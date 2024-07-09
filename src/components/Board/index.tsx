import { Link } from "wouter";
import { store, useRow, useTable } from "~/lib/store";
import { Button } from "~/components/Button";
import { getUserId } from "~/lib/userId";
import { useEffect } from "preact/hooks";

type Props = {
  boardId: string;
};

export function Board({ boardId }: Props) {
  const board = useRow("boards", boardId, store);
  const users = useTable("users", store);
  const userId = getUserId();
  const presence = Object.keys(users).length;

  console.log({ users, board, userId, presence });

  useEffect(() => {
    store.setRow("users", userId, {});

    return () => {
      store.delRow("users", userId);
    };
  }, [userId]);

  const handlePlus5Minutes = () => {
    store.setCell(
      "boards",
      boardId,
      "timer",
      (cell) => (cell ?? Date.now()) + 5 * 60 * 1000
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-12">
        <div className="flex items-center flex-grow justify-between">
          <h1 className="text-2xl font-black">
            <Link href="/boards">Hindsight</Link>
          </h1>

          <span aria-label={`${presence} people connected.`}>
            👤 ×{presence}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button class="text-red-600">Clear</Button>
          <div class="font-mono text-lg">{board.timer}</div>
          <Button onClick={handlePlus5Minutes}>+5 min.</Button>
        </div>

        <div className="flex items-center flex-grow justify-end">
          <Link href={`/boards/${boardId}/`}>Start presentation &rarr;</Link>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto"></div>
    </div>
  );
}
