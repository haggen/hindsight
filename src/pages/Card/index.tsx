import { Board } from "~/components/Board";
import { Card } from "~/components/Card";
import { Column } from "~/components/Column";
import { useCard } from "~/lib/useCard";
import { useSortedCardIdsByBoardId } from "~/lib/useCardIds";

type Props = {
  params: { boardId: string; cardId: string };
};

export default function Page({ params: { boardId, cardId } }: Props) {
  const { columnId } = useCard(cardId);
  const cardIds = useSortedCardIdsByBoardId(boardId);
  const index = cardIds.indexOf(cardId);

  return (
    <Board boardId={boardId}>
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
