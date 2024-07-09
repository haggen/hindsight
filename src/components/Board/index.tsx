"use client";

import { Button } from "@/components/Button";
import { Column } from "@/components/Column";
import { Timer } from "@/components/Timer";
import { api } from "@/lib/client/api";
import type { Id, Board as TBoard } from "@/lib/server/prisma";
import { useQuery } from "@tanstack/react-query";

type Props = {
  id: Id;
};

export function Board({ id }: Props) {
  const { data: board } = useQuery<TBoard>({
    queryKey: ["boards", id],
    queryFn: () => api.get(`/api/boards/${id}`),
  });

  if (!board) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 flex flex-col gap-6">
      <div className="flex items-center gap-12">
        <div className="flex items-center flex-grow justify-between">
          <h1 className="text-2xl font-bold">
            <a href="/">Hindsight</a>
          </h1>

          <span aria-label="9 people connected.">👤 ×9</span>
        </div>

        <Timer board={board} />

        <div className="flex items-center flex-grow justify-end">
          <Button>Start presentation &rarr;</Button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto">
        {board.columns.map((column) => (
          <Column.Existing key={column.id} data={column} />
        ))}
        <Column.New defaults={{ boardId: board.id }} />
      </div>
    </div>
  );
}
