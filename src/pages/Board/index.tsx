import { Board } from "~/components/Board";
import { Column } from "~/components/Column";
import { UiReact } from "~/lib/store";

type Props = {
  params: { boardId: string };
};

export default function Page({ params: { boardId } }: Props) {
  const columnIds = UiReact.useSliceRowIds("columnsByBoardId", boardId);

  return (
    <Board boardId={boardId}>
      <div className="grid grid-flow-col auto-cols-[20rem] gap-3 items-start">
        {columnIds.map((id) => (
          <Column key={id} columnId={id} />
        ))}
        <Column.Blank defaults={{ boardId }} />
      </div>
    </Board>
  );
}
