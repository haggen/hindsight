import type { Ids } from "tinybase";
import { useMemo, useSyncExternalStore } from "react";
import { UiReact, indexes, relationships, store } from "~/lib/store";
import { useColumnIdsByBoardId } from "~/lib/useColumnIds";
import { useVoteIdsByBoardId } from "~/lib/useVoteIds";

// Sort by column, then by votes. Break ties with card creation time.
function compareCards(a: string, b: string) {
  const cards = [store.getRow("cards", a), store.getRow("cards", b)];

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

  const columns = [
    store.getRow("columns", cards[0].columnId),
    store.getRow("columns", cards[1].columnId),
  ];

  return columns[0].createdAt - columns[1].createdAt;
}

export function useCardIdsByColumnId(columnId: string) {
  return UiReact.useSliceRowIds("cardsByColumnId", columnId);
}

export function useCardIdsByBoardId(boardId: string) {
  const columnIds = useColumnIdsByBoardId(boardId);

  const cardIdsSnapshot = useSyncExternalStore(
    (onChange) => {
      const listenerIds = columnIds.map((columnId) =>
        relationships.addLocalRowIdsListener("cardsColumn", columnId, () =>
          onChange()
        )
      );
      return () => {
        for (const listenerId of listenerIds) {
          relationships.delListener(listenerId);
        }
      };
    },
    () =>
      JSON.stringify(
        columnIds.flatMap((columnId) =>
          relationships.getLocalRowIds("cardsColumn", columnId)
        )
      )
  );

  return useMemo(() => JSON.parse(cardIdsSnapshot) as Ids, [cardIdsSnapshot]);
}

export function useSortedCardIdsByBoardId(boardId: string) {
  const cardIds = useCardIdsByBoardId(boardId);
  const voteIds = useVoteIdsByBoardId(boardId);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Since we use vote count in the comparison, we need to invalidate the array when the votes change.
  return useMemo(() => [...cardIds].sort(compareCards), [cardIds, voteIds]);
}
