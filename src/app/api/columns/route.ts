import { createId } from "@/lib/createId";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const data = await request.json();

  const column = await prisma.column.create({
    data: {
      id: createId(),
      boardId: data.boardId,
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
