import type { Ids } from "tinybase";
import { useMemo, useSyncExternalStore } from "react";
import { relationships, UiReact } from "~/lib/store";
import { useCardIdsByBoardId, useCardIdsByColumnId } from "~/lib/useCardIds";

export function useVoteIdsByCardId(cardId: string) {
  return UiReact.useSliceRowIds("votesByCardId", cardId);
}

export function useVoteIdsByColumnId(columnId: string) {
  const cardIds = useCardIdsByColumnId(columnId);

  const voteIdsSnapshot = useSyncExternalStore(
    (onChange) => {
      const listenerIds = cardIds.map((cardId) => {
        return relationships.addLocalRowIdsListener("votesCard", cardId, () =>
          onChange()
        );
      });
      return () => {
        for (const listenerId of listenerIds) {
          relationships.delListener(listenerId);
        }
      };
    },
    () =>
      JSON.stringify(
        cardIds.flatMap((cardId) =>
          relationships.getLocalRowIds("votesCard", cardId)
        )
      )
  );

  return useMemo(() => JSON.parse(voteIdsSnapshot) as Ids, [voteIdsSnapshot]);
}

export function useVoteIdsByBoardId(boardId: string) {
  const cardIds = useCardIdsByBoardId(boardId);

  const voteIdsSnapshot = useSyncExternalStore(
    (onChange) => {
      const listenerIds = cardIds.map((cardId) =>
        relationships.addLocalRowIdsListener("votesCard", cardId, () =>
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
        cardIds.flatMap((cardId) =>
          relationships.getLocalRowIds("votesCard", cardId)
        )
      )
  );

  return useMemo(() => JSON.parse(voteIdsSnapshot) as Ids, [voteIdsSnapshot]);
}
