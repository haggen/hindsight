import { Board } from "@/components/Board";

type Props = {
  params: {
    boardId: string;
  };
};

export default async function Page({ params }: Props) {
  return <Board id={params.boardId} />;
}
