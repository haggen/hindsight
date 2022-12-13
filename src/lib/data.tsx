import { nanoid } from "nanoid";
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

export type Id = string;

export type TColumn = {
  id: Id;
  createdAt: number;
  title: string;
};

export type TCard = {
  id: Id;
  authorId: Id;
  columnId: Id;
  createdAt: number;
  description: string;
  reactions: Record<string, number>;
  reactionCount: number;
};

export type State = {
  columns: Record<Id, TColumn>;
  cards: Record<Id, TCard>;
  timer: number;
};

export type Value = {
  doc: Y.Doc;
  provider: WebrtcProvider | null;
};

// ---
// ---
// ---

export function createId() {
  return nanoid(6);
}

function compareCreatedAt<T extends { createdAt: number }>(a: T, b: T) {
  return a.createdAt - b.createdAt;
}

export function createCard(
  data: Pick<TCard, "authorId" | "columnId" | "description">
): TCard {
  return {
    id: createId(),
    authorId: data.authorId,
    columnId: data.columnId,
    createdAt: Date.now(),
    description: data.description,
    reactions: { "⬆️": 1 },
    reactionCount: 1,
  };
}

export function createColumn(data: Pick<TColumn, "title">): TColumn {
  return {
    id: createId(),
    createdAt: Date.now(),
    title: data.title,
  };
}

// ---
// ---
// ---

const doc = new Y.Doc();

export const Context = createContext<{
  ref: {
    current: Value;
  };
}>({
  ref: {
    current: {
      doc,
      provider: null,
    },
  },
});

type Props = {
  roomId: string;
  children: ReactNode;
};

/**
 * Provider for Y's document and synchronization provider.
 */
export function Provider({ roomId, children }: Props) {
  const ref = useRef<Value>({
    doc,
    provider: null,
  });

  useEffect(() => {
    if (!roomId) {
      return;
    }

    ref.current.provider = new WebrtcProvider(roomId, ref.current.doc);

    return () => {
      ref.current.provider?.destroy();
      ref.current.provider = null;
    };
  }, [roomId]);

  return <Context.Provider value={{ ref }}>{children}</Context.Provider>;
}

function getSnapshot<T extends object>(
  map: Y.Map<T[keyof T]>,
  initialValue: T = {} as T
) {
  return map.size === 0 ? initialValue : (map.toJSON() as T);
}

/**
 * Get snapshot and mutate function to a named Y.Map.
 */
export function useSharedMap<T extends object>(
  name: string,
  initialValue: T = {} as T
) {
  const {
    ref: {
      current: { doc },
    },
  } = useContext(Context);

  const map = doc.getMap<T[keyof T]>(name);
  const [snapshot, setSnapshot] = useState<T>(
    getSnapshot<T>(map, initialValue)
  );

  // console.log("useSharedMap", name, map, snapshot);

  useEffect(() => {
    const onChange = () => {
      const value = getSnapshot<T>(map);
      // console.log("observe", name, value);
      setSnapshot(value);
    };
    map.observe(onChange);

    return () => {
      map.unobserve(onChange);
    };
  }, []);

  const mutate = useCallback((updator: (map: Y.Map<T[keyof T]>) => void) => {
    doc.transact(() => updator(map));
  }, []);

  return [snapshot, mutate] as const;
}

/**
 * Get snapshot and mutate functions for cards.
 */
export function useCards({ columnId }: { columnId?: string } = {}) {
  const [snapshot, mutate] = useSharedMap<Record<string, TCard>>("cards", {});

  const cards = useMemo(
    () =>
      Object.values(snapshot)
        .filter((card) => !columnId || card.columnId === columnId)
        .sort(compareCreatedAt),
    [snapshot, columnId]
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

  const destroy = (id: Id) =>
    mutate((map) => {
      map.delete(id);
    });

  return [cards, { create, update, destroy }] as const;
}

/**
 * Get snapshot and mutate functions for columns.
 */
export function useColumns() {
  const [snapshot, mutate] = useSharedMap<Record<string, TColumn>>(
    "columns",
    {}
  );

  const columns = useMemo(
    () => Object.values(snapshot).sort(compareCreatedAt),
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
