import { Board } from "~/components/Board";

export default function Page({ params }) {
  return <Board boardId={params.boardId} />;
}
