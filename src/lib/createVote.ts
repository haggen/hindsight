import type { Id } from "tinybase";
import { createId } from "~/lib/createId";
import { store } from "~/lib/store";

export function createVote(data: { participantId: Id; cardId: Id }) {
  const voteId = createId();
  store.setRow("votes", voteId, {
    voterId: data.participantId,
    cardId: data.cardId,
  });
}
