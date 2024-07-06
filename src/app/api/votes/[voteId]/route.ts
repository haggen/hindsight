import { prisma } from "@/lib/server/prisma";

type Params = {
  voteId: string;
};

export async function DELETE(request: Request, { params }: { params: Params }) {
  await prisma.column.delete({
    where: {
      id: params.voteId,
    },
  });

  return Response.json(null, { status: 204 });
}
