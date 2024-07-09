import { prisma } from "@/lib/server/prisma";

type Params = {
  columnId: string;
};

export async function GET(request: Request, { params }: { params: Params }) {
  const column = await prisma.column.findUniqueOrThrow({
    where: {
      id: params.columnId,
    },
    include: {
      cards: {
        include: {
          votes: true,
        },
      },
    },
  });

  return Response.json(column);
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  const data = await request.json();

  const column = await prisma.column.update({
    data: {
      description: data.description,
    },
    where: {
      id: params.columnId,
    },
    include: {
      cards: {
        include: {
          votes: true,
        },
      },
    },
  });

  return Response.json(column);
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  await prisma.column.delete({
    where: {
      id: params.columnId,
    },
  });

  return new Response(null, { status: 204 });
}
