// import { default as update } from "immutability-helper";
import { nanoid } from "nanoid";

import * as types from "src/types";

const initialValue = [
  { id: nanoid(), title: "What went well?", color: "green" },
  { id: nanoid(), title: "What could be improved?", color: "yellow" },
  { id: nanoid(), title: "What should be done?", color: "blue" },
];

export const columns = (
  columns: types.Column[] = initialValue,
  action: types.Action
) => {
  switch (action.type) {
    case "board/load":
    case "ostrich/sync/reply":
      return action.payload.columns ?? initialValue;
    default:
      return columns;
  }
};
