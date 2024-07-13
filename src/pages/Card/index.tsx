import { Board } from "~/components/Board";
import { Card } from "~/components/Card";
import { Column } from "~/components/Column";
import { UiReact } from "~/lib/store";

type Props = {
  params: { boardId: string; cardId: string };
};

export default function Page({ params: { boardId, cardId } }: Props) {
  const { columnId } = UiReact.useRow("cards", cardId);

  return (
    <Board boardId={boardId}>
      <div className="">
        <Column columnId={columnId}>
          <Card cardId={cardId} presentation />
        </Column>
      </div>
    </Board>
  );
}
