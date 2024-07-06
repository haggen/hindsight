import { prisma } from "@/lib/server/prisma";
import { getUserId } from "@/lib/server/userId";
import { createId } from "@/lib/shared/createId";

export async function POST(request: Request) {
  const userId = getUserId();

  const data = await request.json();

  const card = await prisma.card.create({
    data: {
      id: createId(),
      columnId: data.columnId,
      description: data.description,
      authorId: userId,
      votes: {
        create: [
          {
            id: createId(),
            voterId: userId,
          },
        ],
      },
    },
    include: {
      votes: true,
    },
  });

  return Response.json(card, { status: 201 });
}
