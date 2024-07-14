import { store } from "~/lib/store";

export function updateCard(cardId: string, data: { description: string }) {
  store.setCell("cards", cardId, "description", data.description);
}
