import { prisma } from "@/lib/server/prisma";
import { getUserId } from "@/lib/server/userId";
import { createId } from "@/lib/shared/createId";

export async function POST(request: Request) {
  const userId = getUserId();

  const data = await request.json();

  const vote = await prisma.vote.create({
    data: {
      id: createId(),
      cardId: data.cardId,
      voterId: userId,
    },
  });

  return Response.json(vote, { status: 201 });
}
