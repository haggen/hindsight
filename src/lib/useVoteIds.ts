import { useMemo, useSyncExternalStore } from "react";
import type { Ids } from "tinybase";
import { UiReact, relationships } from "~/lib/store";
import { useCardIdsByColumnId } from "~/lib/useCardIds";

export function useVoteIdsByCardId(cardId: string) {
  return UiReact.useLocalRowIds("votesCard", cardId);
}

export function useVoteIdsByColumnId(columnId: string) {
  const cardIds = useCardIdsByColumnId(columnId);

  const voteIdsSnapshot = useSyncExternalStore(
    (onChange) => {
      const listenerIds = cardIds.map((cardId) => {
        return relationships.addLocalRowIdsListener("votesCard", cardId, () =>
          onChange(),
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
          relationships.getLocalRowIds("votesCard", cardId),
        ),
      ),
  );

  return useMemo(() => JSON.parse(voteIdsSnapshot) as Ids, [voteIdsSnapshot]);
}

export function useVoteIds() {
  return UiReact.useRowIds("votes");
}
