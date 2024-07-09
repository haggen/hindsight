import { prisma } from "@/lib/server/prisma";
import { createId } from "@/lib/shared/createId";

export async function POST(request: Request) {
  const data = await request.json();

  const column = await prisma.column.create({
    data: {
      id: createId(),
      board: { connect: { id: data.boardId } },
      description: data.description,
    },
    include: {
      cards: {
        include: {
          votes: true,
        },
      },
    },
  });

  return Response.json(column, { status: 201 });
}
