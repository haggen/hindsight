import { prisma } from "@/lib/server/prisma";
import { createId } from "@/lib/shared/createId";

export async function POST(request: Request) {
  const board = await prisma.board.create({
    data: {
      id: createId(),
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

  return Response.json(board, { status: 201 });
}
