import { useEffect } from "react";
import { Redirect } from "wouter";
import { Board } from "~/components/Board";
import { Card } from "~/components/Card";
import { Column } from "~/components/Column";
import { useCard, useSortedCardIds } from "~/lib/data";
import { getParticipantId } from "~/lib/participantId";
import { useContext } from "~/lib/store";

type Props = {
  params: { cardId: string };
};

export default function Page({ params: { cardId } }: Props) {
  const { columnId } = useCard(cardId);
  const cardIds = useSortedCardIds();
  const index = cardIds.indexOf(cardId);
  const participantId = getParticipantId();
  const { store } = useContext();

  useEffect(() => {
    store.setCell(
      "participants",
      participantId,
      "location",
      `/cards/${cardId}`,
    );
  }, [store, participantId, cardId]);

  if (index === -1) {
    return <Redirect to="/" />;
  }

  return (
    <Board>
      <Column columnId={columnId}>
        <Card cardId={cardId} presentation />

        <footer className="text-center">
          <p>
            {index + 1} of {cardIds.length}
          </p>
        </footer>
      </Column>
    </Board>
  );
}
