import type { Id } from "tinybase";
import { indexes, store } from "~/lib/store";

export function deleteCard(cardId: Id) {
  store.transaction(() => {
    const voteIds = indexes.getSliceRowIds("votesByCardId", cardId);
    for (const voteId of voteIds) {
      store.delRow("votes", voteId);
    }
    store.delRow("cards", cardId);
  });
}
