import { useMemo } from "react";
import { getParticipantId } from "~/lib/participantId";
import { store } from "~/lib/store";
import { useVoteIdsByCardId } from "~/lib/useVoteIds";

export function useParticipantVoteId(cardId: string) {
  const participantId = getParticipantId();
  const voteIds = useVoteIdsByCardId(cardId);

  return useMemo(
    () =>
      voteIds.find((voteId) => {
        const voterId = store.getCell("votes", voteId, "voterId");
        return voterId === participantId;
      }),
    [voteIds, participantId],
  );
}
