import { prisma } from "@/lib/server/prisma";

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

export async function PATCH(request: Request, { params }: { params: Params }) {
  const data = await request.json();

  const card = await prisma.card.update({
    where: {
      id: params.cardId,
    },
    data: {
      description: data.description,
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

  return new Response(null, { status: 204 });
}
