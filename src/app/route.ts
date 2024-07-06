import { prisma } from "@/lib/server/prisma";
import { createId } from "@/lib/shared/createId";
import { redirect } from "next/navigation";

export async function GET() {
  const board = await prisma.board.create({
    data: {
      id: createId(),
    },
  });

  redirect(`/boards/${board.id}`);
}
