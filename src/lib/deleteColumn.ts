import type { Id } from "tinybase";
import { deleteCard } from "~/lib/deleteCard";
import { indexes, store } from "~/lib/store";

export function deleteColumn(columnId: Id) {
  store.transaction(() => {
    const cardIds = indexes.getSliceRowIds("cardsByColumnId", columnId);
    for (const cardId of cardIds) {
      deleteCard(cardId);
    }
    store.delRow("columns", columnId);
  });
}
