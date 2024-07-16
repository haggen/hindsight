import { Board } from "~/components/Board";
import { Columns } from "~/components/Columns";

type Props = {
  params: { boardId: string };
};

export default function Page({ params: { boardId } }: Props) {
  return (
    <Board boardId={boardId}>
      <Columns />
    </Board>
  );
}
