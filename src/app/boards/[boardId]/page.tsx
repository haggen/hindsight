import { Button } from "@/components/Button";
import { Column } from "@/components/Column";
import { Timer } from "@/components/Timer";
import { prisma } from "@/lib/server/prisma";

type Props = {
  params: {
    boardId: string;
  };
};

export default async function Page({ params }: Props) {
  const board = await prisma.board.findUniqueOrThrow({
    where: { id: params.boardId },
    include: { columns: { include: { cards: { include: { votes: true } } } } },
  });

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <div className="flex items-center gap-12">
        <div className="flex items-center flex-grow justify-between">
          <h1 className="text-2xl font-bold">
            <a href="/">Hindsight</a>
          </h1>

          <span>👤 ×8</span>
        </div>

        <Timer boardId={params.boardId} />

        <div className="flex items-center flex-grow justify-end">
          <Button>Start presentation &rarr;</Button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto">
        {board.columns.map((column) => (
          <Column key={column.id} data={column} />
        ))}
      </div>
    </div>
  );
}
