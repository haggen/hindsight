import { Board } from "~/components/Board";
import { Card } from "~/components/Card";
import { Column } from "~/components/Column";
import { useCard, useSortedCardIds } from "~/lib/data";

type Props = {
  params: { boardId: string; cardId: string };
};

export default function Page({ params: { cardId } }: Props) {
  const { columnId } = useCard(cardId);
  const cardIds = useSortedCardIds();
  const index = cardIds.indexOf(cardId);

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
