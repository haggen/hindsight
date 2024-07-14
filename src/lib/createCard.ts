import { createId } from "~/lib/createId";
import { store } from "~/lib/store";

export function createCard(data: {
  participantId: string;
  columnId: string;
  description: string;
}) {
  store.transaction(() => {
    const cardId = createId();

    store.setRow("cards", cardId, {
      authorId: data.participantId,
      columnId: data.columnId,
      createdAt: Date.now(),
      description: data.description,
    });

    const voteId = createId();

    store.setRow("votes", voteId, {
      cardId,
      voterId: data.participantId,
    });
  });
}
