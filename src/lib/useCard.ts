import { UiReact } from "~/lib/store";

export function useCard(cardId: string) {
  return UiReact.useRow("cards", cardId);
}
