import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { ulid } from "ulid";
import YouTubePlayer, { YouTubePlayerProps } from "react-player/youtube";

import { useForceUpdate } from "~/src/hooks/useForceUpdate";
import { useInterval } from "~/src/hooks/useInterval";

export type Id = string;

export type TColumn = {
  id: Id;
  title: string;
};

export type TCard = {
  id: Id;
  authorId: Id;
  columnId: Id;
  description: string;
  votes: string[];
};

// ---
// ---
// ---

/**
 * Create unique URL-safe ID.
 */
export function createId() {
  return ulid().toLocaleLowerCase();
}

/**
 * Sort ID'ables.
 */
function compareId<T extends { id: Id }>(a: T, b: T) {
  return a.id.localeCompare(b.id);
}

/**
 * Compare cards by column.
 */
function compareCardsByColumn(a: TCard, b: TCard) {
  return a.columnId.localeCompare(b.columnId);
}

/**
 * Compare cards by votes, higher first.
 */
function compareCardsByVotes(a: TCard, b: TCard) {
  return b.votes.length - a.votes.length;
}

/**
 * Create new Card.
 */
export function createCard(
  data: Pick<TCard, "authorId" | "columnId" | "description">
): TCard {
  return {
    id: createId(),
    authorId: data.authorId,
    columnId: data.columnId,
    description: data.description,
    votes: [data.authorId],
  };
}

/**
 * Create new Column.
 */
export function createColumn(data: Pick<TColumn, "title">): TColumn {
  return {
    id: createId(),
    title: data.title,
  };
}

// ---
// ---
// ---

export type ContextValue = {
  doc: Y.Doc;
  provider: WebrtcProvider | null;
};

const doc = new Y.Doc();

export const Context = createContext<ContextValue>({
  doc,
  provider: null,
});

type Props = {
  roomId: string;
  children: ReactNode;
};

/**
 * Provider for Y's document and synchronization provider.
 */
export function Provider({ roomId, children }: Props) {
  const forceUpdate = useForceUpdate();
  const providerRef = useRef<WebrtcProvider | null>(null);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    providerRef.current = new WebrtcProvider(roomId, doc, {
      signaling: ["wss://signaling.crz.li"],
    });
    forceUpdate();

    return () => {
      providerRef.current?.destroy();
      providerRef.current = null;
    };
  }, [forceUpdate, roomId]);

  return (
    <Context.Provider value={{ doc, provider: providerRef.current }}>
      {children}
    </Context.Provider>
  );
}

function getSharedMapSnapshot<T extends object>(
  map: Y.Map<T[keyof T]>
  // initialValue: T = {} as T
) {
  return map.toJSON() as T;
  // return map.size === 0 ? initialValue : (map.toJSON() as T);
}

/**
 * Get snapshot and mutate function to a named Y.Map.
 */
export function useSharedMap<T extends object>(name: string) {
  const { doc } = useContext(Context);

  const map = doc.getMap<T[keyof T]>(name);

  const [snapshot, setSnapshot] = useState<T>(getSharedMapSnapshot<T>(map));

  useEffect(() => {
    const onChange = () => {
      const value = getSharedMapSnapshot<T>(map);
      setSnapshot(value);
    };
    map.observe(onChange);

    return () => {
      map.unobserve(onChange);
    };
  }, [map]);

  const mutate = useCallback(
    (updator: (map: Y.Map<T[keyof T]>) => void) => {
      doc.transact(() => updator(map));
    },
    [doc, map]
  );

  return [snapshot, mutate] as const;
}

// ---
// ---
// ---

export enum SharedState {
  Cards = "cards",
  Columns = "columns",
  Timer = "timer",
  Presentation = "presentation",
  Player = "player",
}

/**
 * Get and mutate presentation state.
 */
export function usePresentation() {
  const [{ index = -1, finished = false }, mutate] = useSharedMap<{
    index: number;
    finished: boolean;
  }>(SharedState.Presentation);
  const [cards] = useSharedMap<Record<string, TCard>>(SharedState.Cards);
  const [columns] = useSharedMap<Record<string, TColumn>>(SharedState.Columns);

  const list = Object.values(cards).sort(
    (a, b) =>
      compareCardsByColumn(a, b) || compareCardsByVotes(a, b) || compareId(a, b)
  );
  const active = index > -1;
  const card = list[index];
  const column = columns[card?.columnId];
  const hasNext = list.length > 0 && index < list.length - 1;
  const hasPrev = index > 0;
  const length = list.length;

  const next = () => {
    mutate((map) => {
      if (hasNext) {
        map.set("index", index + 1);
      } else {
        map.set("finished", true);
      }
    });
  };

  const prev = () => {
    mutate((map) => {
      if (finished) {
        map.set("finished", false);
      } else if (hasPrev) {
        map.set("index", index - 1);
      } else {
        map.set("index", -1);
        map.set("finished", false);
      }
    });
  };

  return active
    ? ({
        active,
        finished,
        index,
        length,
        card,
        column,
        hasNext,
        hasPrev,
        next,
        prev,
      } as const)
    : ({
        active,
        finished,
        index,
        length,
        hasNext,
        hasPrev,
        next,
        prev,
      } as const);
}

/**
 * Get snapshot and mutate functions for cards.
 */
export function useCards(filter: { columnId?: string } = {}) {
  const [snapshot, mutate] = useSharedMap<Record<string, TCard>>(
    SharedState.Cards
  );

  const list = useMemo(
    () =>
      Object.values(snapshot)
        .filter(
          ({ columnId }) =>
            filter.columnId === undefined || filter.columnId === columnId
        )
        .sort(compareId),
    [snapshot, filter?.columnId]
  );

  const create = (
    defaults: Pick<TCard, "columnId" | "authorId" | "description">
  ) =>
    mutate((map) => {
      const card = createCard(defaults);
      map.set(card.id, card);
    });

  const update = (data: Semipartial<TCard, "id">) =>
    mutate((map) => {
      const card = map.get(data.id);
      if (!card) {
        throw new Error(`Card "${data.id}" not found`);
      }
      map.set(data.id, { ...card, ...data });
    });

  const vote = ({ id, clientId }: { id: Id; clientId: Id }) =>
    mutate((map) => {
      const card = map.get(id);
      if (!card) {
        throw new Error(`Card "${id}" not found`);
      }
      if (!card.votes.includes(clientId)) {
        map.set(id, { ...card, votes: [...card.votes, clientId] });
      }
    });

  const unvote = ({ id, clientId }: { id: Id; clientId: Id }) =>
    mutate((map) => {
      const card = map.get(id);
      if (!card) {
        throw new Error(`Card "${id}" not found`);
      }
      if (card.votes.includes(clientId)) {
        map.set(id, {
          ...card,
          votes: card.votes.filter((id) => id !== clientId),
        });
      }
    });

  const destroy = (id: Id) =>
    mutate((map) => {
      map.delete(id);
    });

  return {
    list,
    map: snapshot,
    create,
    update,
    vote,
    unvote,
    destroy,
  } as const;
}

/**
 * Get snapshot and mutate functions for columns.
 */
export function useColumns() {
  const [snapshot, mutate] = useSharedMap<Record<string, TColumn>>(
    SharedState.Columns
  );

  const columns = useMemo(
    () => Object.values(snapshot).sort(compareId),
    [snapshot]
  );

  const create = (defaults: Pick<TColumn, "title">) =>
    mutate((map) => {
      const column = createColumn(defaults);
      map.set(column.id, column);
    });

  const update = (data: Semipartial<TColumn, "id">) =>
    mutate((map) => {
      const column = map.get(data.id);
      if (!column) {
        throw new Error(`Column "${data.id}" not found`);
      }
      map.set(data.id, { ...column, ...data });
    });

  const destroy = (id: Id) =>
    mutate((map) => {
      map.delete(id);
    });

  return [columns, { create, update, destroy }] as const;
}

function getAwarenessStateSnapshot<T extends object>(awareness: Awareness) {
  const states = Object.fromEntries(
    (awareness.getStates() as Map<number, T>).entries()
  );
  return states;
}

type Timer = {
  target: number;
};

/**
 * Timer state.
 */
export function useTimer() {
  const [{ target = 0 }, mutate] = useSharedMap<Timer>(SharedState.Timer);
  const forceUpdate = useForceUpdate();
  const active = target > Date.now();

  useInterval(() => {
    if (target > 0 && target < Date.now()) {
      forceUpdate();
    }
  }, 100);

  const add = (seconds: number) => {
    mutate((map) => {
      map.set("target", Math.max(target, Date.now()) + 1000 * seconds);
    });
  };

  const clear = () => {
    mutate((map) => {
      map.set("target", 0);
    });
  };

  return { active, target, add, clear } as const;
}

/**
 * Get and subscribe to awareness state.
 */
export function useAwareness<T extends object>() {
  const { provider } = useContext(Context);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (!provider) {
      return;
    }

    const onChange = () => {
      forceUpdate();
    };
    provider.awareness.on("change", onChange);
    return () => {
      provider.awareness.off("change", onChange);
    };
  }, [forceUpdate, provider]);

  const states = provider
    ? getAwarenessStateSnapshot<T>(provider.awareness)
    : {};

  const setLocalState = useCallback(
    (state: T) => {
      provider?.awareness.setLocalState(state);
    },
    [provider]
  );

  return {
    clientId: provider ? String(provider.awareness.clientID) : "",
    count: Object.keys(states).length,
    states,
    setLocalState,
  } as const;
}

type Player = {
  playing: boolean;
  played: number;
  state: string;
  url: string;
  queue: string[];
};

function sanitizeVideoUrl(raw: string) {
  const url = new URL(raw);
  url.searchParams.delete("index");
  url.searchParams.delete("list");
  return url.toString();
}

/**
 * Music player state.
 */
export function usePlayer() {
  const [{ playing = false, played = 0, url = "", queue = [] }, mutate] =
    useSharedMap<Player>(SharedState.Player);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(true);
  const [ended, setEnded] = useState(false);
  const ref = useRef<YouTubePlayer>(null);

  useEffect(() => {
    const now = ref.current?.getCurrentTime();
    if (now === undefined) {
      return;
    }
    const diff = Math.abs(played - now);
    if (diff > 3) {
      ref.current?.seekTo(played, "seconds");
    }
  }, [played]);

  const handleProgress: YouTubePlayerProps["onProgress"] = (progress) => {
    if (progress.playedSeconds > played) {
      mutate((map) => {
        map.set("played", progress.playedSeconds);
      });
    }
  };

  const handleEnded = () => {
    // People are (hopefully) 2 seconds off at most, so we wait 1 second before	starting the next song.
    // setTimeout(() => next(), 1000);
    next();
  };

  const handlePlay = () => {
    if (!playing) {
      play();
    }
  };

  const handlePause = () => {
    if (playing) {
      pause();
    }
  };

  const play = (newUrl?: string) => {
    setEnded(false);

    mutate((map) => {
      map.set("playing", true);

      if (newUrl === url) {
        map.set("played", 0);
      } else if (newUrl) {
        map.set("url", sanitizeVideoUrl(newUrl));
      }
    });
  };

  const next = () => {
    const index = queue.indexOf(url);
    const nextUrl = queue[index + 1];
    if (nextUrl) {
      play(nextUrl);
    } else {
      mutate((map) => {
        map.set("playing", false);
        map.set("played", 0);
      });
    }
  };

  const pause = () => {
    mutate((map) => {
      map.set("playing", false);
    });
  };

  const add = (url: string) => {
    mutate((map) => {
      map.set("queue", [...queue, url]);
    });
  };

  const remove = (target: string) => {
    mutate((map) => {
      map.set(
        "queue",
        queue.filter((url) => url !== target)
      );
      if (target === url) {
        map.set("url", "");
        map.set("playing", false);
      }
    });
  };

  const mute = () => {
    setMuted(true);
  };

  const unmute = () => {
    setMuted(false);
  };

  return {
    ref,
    playing: playing && !ended,
    url,
    volume,
    muted,
    next,
    play,
    pause,
    handlePlay,
    handlePause,
    setVolume,
    mute,
    unmute,
    played,
    handleProgress,
    ended,
    handleEnded,
    queue,
    add,
    remove,
  } as const;
}
