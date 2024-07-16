import type { Id } from "tinybase";
import { relationships, store } from "~/lib/store";

export function deleteCard(cardId: Id) {
  store.transaction(() => {
    const voteIds = relationships.getLocalRowIds("votesCard", cardId);
    for (const voteId of voteIds) {
      store.delRow("votes", voteId);
    }
    store.delRow("cards", cardId);
  });
}
