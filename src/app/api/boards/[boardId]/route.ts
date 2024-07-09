import { prisma } from "@/lib/server/prisma";

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

export async function PATCH(request: Request, { params }: { params: Params }) {
  const data = await request.json();

  const board = await prisma.board.update({
    data: {
      presentsAt: data.presentsAt,
    },
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
