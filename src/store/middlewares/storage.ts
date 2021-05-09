import { Middleware, MiddlewareAPI } from "redux";

import { Action } from "src/types";
import { Dispatch, State } from "src/store";

export const storage: Middleware = (api: MiddlewareAPI<Dispatch, State>) => (
  next: Dispatch
) => (action: Action) => {
  if (action.type === "board/load") {
    const key = `board-${action.payload.id}`;
    const item = localStorage.getItem(key);
    if (item) {
      const { cards, columns } = JSON.parse(item);
      action.payload = { ...action.payload, columns, cards };
    }
  }

  next(action);

  const { board, cards, columns } = api.getState();

  if (board.id) {
    const key = `board-${board.id}`;
    localStorage.setItem(key, JSON.stringify({ cards, columns }));
  }
};
