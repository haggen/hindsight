import { LiveMap } from "@liveblocks/client";
import { nanoid } from "nanoid";
import { useStorage, useMutation } from "~/src/lib/liveblocks";

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

export const initialPresence = {
  id: getOrCreatePresenceId(),
};

export const initialStorage = {
  timer: 0,
  cards: new LiveMap<Id, TCard>(),
  columns: new LiveMap<Id, TColumn>(),
};

function getOrCreatePresenceId() {
  const storedPresenceId = localStorage.getItem("presenceId");
  if (storedPresenceId) {
    return storedPresenceId;
  }
  const presenceId = createId();
  localStorage.setItem("presenceId", presenceId);
  return presenceId;
}

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
    reactions: {
      "⬆️": 1,
    },
    reactionCount: 1,
  };
}

export function createColumn(data: Pick<TColumn, "title">): TColumn {
  return {
    id: createId(),
    title: data.title,
  };
}

export function getStoredPresence() {
  const presence = localStorage.getItem("presence");
  if (presence) {
    return JSON.parse(presence);
  }
  return { name: "Anonymous" };
}

export function storePresence(presence: typeof initialPresence) {
  localStorage.setItem("presence", JSON.stringify(presence));
}

export function useColumns() {
  const value = useStorage(({ columns }) => {
    return Array.from(columns.values());
  });

  const create = useMutation(({ storage }, data: Pick<TColumn, "title">) => {
    const column = createColumn(data);
    storage.get("columns").set(column.id, column);
  }, []);

  const patch = useMutation(({ storage }, data: Semipartial<TColumn, "id">) => {
    const column = storage.get("columns").get(data.id);
    if (!column) {
      throw new Error(`Column "${data.id}" not found`);
    }
    storage.get("columns").set(column.id, { ...column, ...data });
  }, []);

  const remove = useMutation(({ storage }, id: Id) => {
    storage.get("columns").delete(id);
  }, []);

  return [value, { create, patch, remove }] as const;
}

export function useCards({ columnId }: { columnId?: Id } = {}) {
  const value = useStorage((root) => {
    return Array.from(root.cards.values())
      .filter((card) =>
        columnId !== undefined ? card.columnId === columnId : true
      )
      .sort((a, b) => a.createdAt - b.createdAt);
  });

  const create = useMutation(
    (
      { storage },
      data: Pick<TCard, "columnId" | "authorId" | "description">
    ) => {
      const card = createCard(data);
      storage.get("cards").set(card.id, card);
    },
    []
  );

  const patch = useMutation(({ storage }, data: Semipartial<TCard, "id">) => {
    const card = storage.get("cards").get(data.id);
    if (!card) {
      throw new Error(`Card "${data.id}" not found`);
    }
    storage.get("cards").set(card.id, { ...card, ...data });
  }, []);

  const remove = useMutation(({ storage }, id: Id) => {
    storage.get("cards").delete(id);
  }, []);

  const react = useMutation(
    ({ storage }, data: { id: Id; reaction: string }) => {
      const card = storage.get("cards").get(data.id);

      if (!card) {
        throw new Error(`Card "${data.id}" not found`);
      }

      card.reactions[data.reaction] = (card.reactions[data.reaction] ?? 0) + 1;
      card.reactionCount += 1;

      storage.get("cards").set(card.id, card);
    },
    []
  );

  return [value, { create, patch, remove, react }] as const;
}
