import { nanoid } from "nanoid";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

export type Id = string;

export type TColumn = {
  id: Id;
  title: string;
};

export type TCard = {
  id: Id;
  createdAt: number;
  authorId: Id;
  columnId: Id;
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
    title: data.title,
  };
}

// ---
// ---
// ---

const doc = new Y.Doc();
const topLevelState = doc.getMap("state");

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

export function Provider({ roomId, children }: Props) {
  const ref = useRef<Value>({
    doc,
    provider: null,
  });

  useEffect(() => {
    if (!roomId || ref.current.provider) {
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

export function useSharedState() {
  const {
    ref: {
      current: { doc },
    },
  } = useContext(Context);

  const [state, setState] = useState<State>(topLevelState.toJSON() as any);

  useEffect(() => {
    const onChange = () => {
      setState(topLevelState.toJSON() as any);
    };
    topLevelState.observeDeep(onChange);

    return () => {
      topLevelState.unobserveDeep(onChange);
    };
  }, []);

  const update = useCallback((updator: (state: Y.Map<any>) => void) => {
    doc.transact(() => {
      updator(topLevelState);
    });
  }, []);

  return [state, update] as const;
}

export function useProvider() {
  const {
    ref: {
      current: { provider },
    },
  } = useContext(Context);

  return provider;
}

export function useCards({ columnId = undefined } = {}) {
  const [state, mutate] = useSharedState();

  const cards = Object.values(state.cards).filter((card) =>
    columnId ? card.columnId === columnId : true
  );

  const create = (
    defaults: Pick<TCard, "columnId" | "authorId" | "description">
  ) =>
    mutate((state) => {
      const card = createCard(defaults);
      state.get("cards").set(card.id, card);
    });

  const update = (data: Semipartial<TCard, "id">) => undefined;

  const destroy = (id: Id) => undefined;

  return [cards, { create, update, destroy }] as const;
}

export function useColumns() {
  const [state, mutate] = useSharedState();

  const columns = Object.values(state.columns);

  const create = (defaults: Pick<TColumn, "title">) =>
    mutate((state) => {
      const column = createColumn(defaults);
      state.get("columns").set(column.id, column);
    });

  const update = (data: Semipartial<TColumn, "id">) => undefined;

  const destroy = (id: Id) => undefined;

  return [columns, { create, update, destroy }] as const;
}
