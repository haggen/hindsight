import { prisma } from "@/lib/prisma";

type Params = {
  cardId: string;
};

export async function GET(request: Request, { params }: { params: Params }) {
  const card = await prisma.card.findUniqueOrThrow({
    where: {
      id: params.cardId,
    },
    include: {
      votes: true,
    },
  });

  return Response.json(card);
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  await prisma.card.delete({
    where: {
      id: params.cardId,
    },
  });

  return Response.json(null, { status: 204 });
}
