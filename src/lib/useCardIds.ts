import { useMemo } from "react";
import { UiReact, relationships, store } from "~/lib/store";

// Sort by column, then by votes. Break ties with card creation time.
function compareCards(a: string, b: string) {
  const cards = [store.getRow("cards", a), store.getRow("cards", b)];

  const votes = [
    relationships.getLocalRowIds("votesCard", a).length,
    relationships.getLocalRowIds("votesCard", b).length,
  ];

  if (cards[0].columnId === cards[1].columnId) {
    if (votes[0] === votes[1]) {
      return cards[0].createdAt - cards[1].createdAt;
    }

    return votes[1] - votes[0];
  }

  const columns = [
    store.getRow("columns", cards[0].columnId),
    store.getRow("columns", cards[1].columnId),
  ];

  return columns[0].createdAt - columns[1].createdAt;
}

export function useCardIds() {
  return UiReact.useRowIds("cards");
}

export function useCardIdsByColumnId(columnId: string) {
  return UiReact.useLocalRowIds("cardsColumn", columnId);
}

export function useSortedCardIds() {
  const cardIds = UiReact.useRowIds("cards");
  const voteIds = UiReact.useRowIds("votes");

  // biome-ignore lint/correctness/useExhaustiveDependencies: Since we use vote count in the comparison, we need to invalidate the array when the votes change.
  return useMemo(() => [...cardIds].sort(compareCards), [cardIds, voteIds]);
}
