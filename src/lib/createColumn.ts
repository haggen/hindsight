import { createId } from "~/lib/createId";
import { store } from "~/lib/store";

export function createColumn(data: { description: string }) {
  const columnId = createId();

  store.setRow("columns", columnId, {
    createdAt: Date.now(),
    description: data.description,
  });
}
