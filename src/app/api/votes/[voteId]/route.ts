import { prisma } from "@/lib/server/prisma";

type Params = {
  voteId: string;
};

export async function DELETE(request: Request, { params }: { params: Params }) {
  await prisma.vote.delete({
    where: {
      id: params.voteId,
    },
  });

  return new Response(null, { status: 204 });
}
