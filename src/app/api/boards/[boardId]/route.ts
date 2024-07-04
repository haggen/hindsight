import { prisma } from "@/lib/prisma";

type Params = {
  boardId: string;
};

export async function GET(request: Request, { params }: { params: Params }) {
  const board = await prisma.board.findUniqueOrThrow({
    where: {
      id: params.boardId,
    },
    include: {
      columns: {
        include: {
          cards: {
            include: {
              votes: true,
            },
          },
        },
      },
    },
  });

  return Response.json(board);
}
