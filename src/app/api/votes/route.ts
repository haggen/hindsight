import { createId } from "@/lib/createId";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/lib/userId";

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
