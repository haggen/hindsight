import { default as update } from "immutability-helper";

import * as types from "src/types";

export const board = (
  board: types.Board = { id: "" },
  action: types.Action
) => {
  switch (action.type) {
    case "board/load":
      return update(board, { id: { $set: action.payload.id } });
    default:
      return board;
  }
};
