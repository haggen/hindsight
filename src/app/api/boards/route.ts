import { createId } from "@/lib/createId";
import { prisma } from "@/lib/prisma";

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
