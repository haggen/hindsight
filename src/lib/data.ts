import { useEffect, useMemo, useSyncExternalStore } from "react";
import type { Id, Ids, Store } from "tinybase/with-schemas";
import { createId } from "~/lib/createId";
import { getParticipantId } from "~/lib/participantId";
import {
  type Context,
  type Schema,
  UiReact,
  useStoreContext,
} from "~/lib/store";

export function useBoard() {
  return UiReact.useValues();
}

// --
// --
// --

export function useParticipantIds() {
  return UiReact.useRowIds("participants");
}

export function useParticipation(store: Store<Schema>) {
  const participantId = getParticipantId();

  useEffect(() => {
    console.log("Joining participant:", participantId);
    store.setRow("participants", participantId, {});

    const handleVisibilityChange = () => {
      switch (document.visibilityState) {
        case "visible":
          console.log("Joining participant:", participantId);
          store.setRow("participants", participantId, {});
          break;
        case "hidden":
          console.log("Leaving participant:", participantId);
          store.delRow("participants", participantId);
          break;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      console.log("Leaving participant:", participantId);
      store.delRow("participants", participantId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [store, participantId]);
}

// --
// --
// --

export function createColumn(
  { store }: Context,
  data: { description: string },
) {
  const columnId = createId();

  store.setRow("columns", columnId, {
    createdAt: Date.now(),
    description: data.description,
  });
}

export function deleteColumn(context: Context, columnId: Id) {
  context.store.transaction(() => {
    const cardIds = context.indexes.getSliceRowIds("cardsByColumnId", columnId);
    for (const cardId of cardIds) {
      deleteCard(context, cardId);
    }
    context.store.delRow("columns", columnId);
  });
}

export function updateColumn(
  { store }: Context,
  columnId: Id,
  data: { description: string },
) {
  store.setCell("columns", columnId, "description", data.description);
}

export function useColumnIds() {
  return UiReact.useRowIds("columns");
}

export function useColumn(columnId: string) {
  return UiReact.useRow("columns", columnId);
}

// --
// --
// --

export function createVote(
  { store }: Context,
  data: { participantId: Id; cardId: Id },
) {
  const voteId = createId();
  store.setRow("votes", voteId, {
    voterId: data.participantId,
    cardId: data.cardId,
  });
}

export function deleteVote({ store }: Context, voteId: Id) {
  store.delRow("votes", voteId);
}

export function useVoteIdsByCardId(cardId: string) {
  return UiReact.useLocalRowIds("votesCard", cardId);
}

export function useVoteIdsByColumnId(context: Context, columnId: string) {
  const cardIds = useCardIdsByColumnId(columnId);

  const voteIdsSnapshot = useSyncExternalStore(
    (onChange) => {
      const listenerIds = cardIds.map((cardId) => {
        return context.relationships.addLocalRowIdsListener(
          "votesCard",
          cardId,
          () => onChange(),
        );
      });
      return () => {
        for (const listenerId of listenerIds) {
          context.relationships.delListener(listenerId);
        }
      };
    },
    () =>
      JSON.stringify(
        cardIds.flatMap((cardId) =>
          context.relationships.getLocalRowIds("votesCard", cardId),
        ),
      ),
  );

  return useMemo(() => JSON.parse(voteIdsSnapshot) as Ids, [voteIdsSnapshot]);
}

export function useVoteIds() {
  return UiReact.useRowIds("votes");
}

export function useParticipantVoteId(cardId: string) {
  const { store } = useStoreContext();
  const participantId = getParticipantId();
  const voteIds = useVoteIdsByCardId(cardId);

  return useMemo(
    () =>
      voteIds.find((voteId) => {
        const voterId = store.getCell("votes", voteId, "voterId");
        return voterId === participantId;
      }),
    [store, voteIds, participantId],
  );
}

// --
// --
// --

export function createCard(
  { store }: Context,
  data: {
    participantId: string;
    columnId: string;
    description: string;
  },
) {
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

export function deleteCard({ store, relationships }: Context, cardId: Id) {
  store.transaction(() => {
    const voteIds = relationships.getLocalRowIds("votesCard", cardId);
    for (const voteId of voteIds) {
      store.delRow("votes", voteId);
    }
    store.delRow("cards", cardId);
  });
}

export function updateCard(
  { store }: Context,
  cardId: string,
  data: { description: string },
) {
  store.setCell("cards", cardId, "description", data.description);
}

// Sort by column, then by votes. Break ties with card creation time.
function compareCards({ store, relationships }: Context, a: string, b: string) {
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
  const context = useStoreContext();
  const cardIds = UiReact.useRowIds("cards");
  const voteIds = UiReact.useRowIds("votes");

  // biome-ignore lint/correctness/useExhaustiveDependencies: Since we use vote count in the comparison, we need to invalidate the array when the votes change.
  return useMemo(
    () => [...cardIds].sort((a, b) => compareCards(context, a, b)),
    [cardIds, voteIds],
  );
}

export function useCard(cardId: string) {
  return UiReact.useRow("cards", cardId);
}

// --
// --
// --
