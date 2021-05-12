import { default as update } from "immutability-helper";

import * as types from "src/types";

const toggle =
  <T>(value: T) =>
  (array: T[]) => {
  const index = array.indexOf(value);
  if (index > -1) {
    return array.slice(0, index).concat(array.slice(index + 1));
  }
  return array.concat(value);
};

export const cards = (cards: types.Card[] = [], action: types.Action) => {
  switch (action.type) {
    case "cards/create":
      return update(cards, {
        $push: [action.payload],
      });
    case "cards/delete":
      return cards.filter(({ id }) => id !== action.payload.cardId);
    case "cards/vote":
      const i = cards.findIndex(({ id }) => id === action.payload.cardId);
      return update(cards, {
        [i]: {
          voterIds: toggle(action.payload.voterId),
        },
      });
    case "board/load":
      return action.payload.cards ?? [];
    case "board/clear":
      return [];
    default:
      return cards;
  }
};
