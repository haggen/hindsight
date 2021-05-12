import { Middleware, MiddlewareAPI, Dispatch } from "redux";

import { Action, Card, Column } from "src/types";
import { State } from "src/store";

const load = (id: string) => {
  const item = localStorage.getItem(`board-${id}`);
  if (item) {
    return JSON.parse(item);
  }
  return {};
};

const store = (id: string, data: { cards: Card[]; columns: Column[] }) => {
  if (id) {
    localStorage.setItem(`board-${id}`, JSON.stringify(data));
  }
};

export const persistence: Middleware =
  (api: MiddlewareAPI<Dispatch, State>) => (next) => (action: Action) => {
    if (action.type === "board/load") {
      action.payload = { ...action.payload, ...load(action.payload.id) };
    }

    next(action);

    const {
      board: { id },
      cards,
      columns,
    } = api.getState();

    store(id, { cards, columns });
  };
