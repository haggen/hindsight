export type Profile = { id: string; name: string };

export type Board = { id: string };

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

export type Action =
  | { type: "cards/push"; payload: Card }
  | { type: "cards/delete"; payload: { id: string } }
  | { type: "cards/vote"; payload: { id: string; voterId: string } }
  | {
      type: "board/load";
      payload: { id: string; cards?: Card[]; columns?: Column[] };
    }
  | { type: "board/clear" }
  | { type: "profile/update"; payload: Partial<Profile> };
