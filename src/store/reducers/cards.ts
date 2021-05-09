import { default as update } from "immutability-helper";

import * as types from "src/types";

export const cards = (cards: types.Card[] = [], action: types.Action) => {
  switch (action.type) {
    case "cards/push":
      return update(cards, {
        $push: [action.payload],
      });
    case "cards/delete":
      return cards.filter(({ id }) => id !== action.payload.id);
    case "cards/vote":
      return update(cards, {});
    case "board/load":
      return action.payload.cards ?? [];
    default:
      return cards;
  }
};
