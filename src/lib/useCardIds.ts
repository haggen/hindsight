import { useMemo } from "react";
import { UiReact, indexes, store } from "~/lib/store";

// Sort by column, then by votes, then by card creation date.
function compareCards(a: string, b: string) {
  const cards = [store.getRow("cards", a), store.getRow("cards", b)];
  const columns = [
    store.getRow("columns", cards[0].columnId),
    store.getRow("columns", cards[1].columnId),
  ];
  const votes = [
    indexes.getSliceRowIds("votesByCardId", a).length,
    indexes.getSliceRowIds("votesByCardId", b).length,
  ];

  if (cards[0].columnId === cards[1].columnId) {
    if (votes[0] === votes[1]) {
      return cards[0].createdAt - cards[1].createdAt;
    }

    return votes[1] - votes[0];
  }

  return columns[0].createdAt - columns[1].createdAt;
}

export function useCardIdsByColumnId(columnId: string) {
  return UiReact.useSliceRowIds("cardsByColumnId", columnId);
}

export function useSortedCardIdsByBoardId(boardId: string) {
  const cardIds = UiReact.useSliceRowIds("cardsByBoardId", boardId);
  const voteIds = UiReact.useSliceRowIds("votesByBoardId", boardId);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Ensure vote indexes are up-to-date.
  return useMemo(() => [...cardIds].sort(compareCards), [cardIds, voteIds]);
}
