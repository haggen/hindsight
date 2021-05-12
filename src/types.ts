export type Profile = { id: string; name: string };

export type Board = { id: string; cards?: Card[]; columns?: Column[] };

export type Card = {
  id: string;
  columnId: string;
  text: string;
  color: string;
  voterIds: string[];
};

export type Column = {
  id: string;
  title: string;
  color: string;
};

type ActionTemplate<T extends string, P = undefined> = P extends undefined
  ? {
      type: T;
      meta?: Record<string, unknown>;
    }
  : {
      type: T;
      meta?: Record<string, unknown>;
      payload: P;
    };

export type Action =
  | ActionTemplate<"profile/update", Partial<Profile>>
  | ActionTemplate<"cards/create", Card>
  | ActionTemplate<"cards/vote", { cardId: string; voterId: string }>
  | ActionTemplate<"cards/delete", { cardId: string }>
  | ActionTemplate<"board/load", Board>
  | ActionTemplate<"board/clear">
  | ActionTemplate<"ostrich/connect", { boardId: string }>
  | ActionTemplate<"ostrich/sync/reply", Board>
  | ActionTemplate<"ostrich/sync/request">;
