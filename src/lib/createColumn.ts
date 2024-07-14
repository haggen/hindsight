import { createId } from "~/lib/createId";
import { store } from "~/lib/store";

export function createColumn(data: { boardId: string; description: string }) {
  const columnId = createId();

  store.setRow("columns", columnId, {
    boardId: data.boardId,
    createdAt: Date.now(),
    description: data.description,
  });
}
