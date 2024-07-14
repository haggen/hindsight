import type { Id } from "tinybase";
import { store } from "~/lib/store";

export function updateColumn(columnId: Id, data: { description: string }) {
  store.setCell("columns", columnId, "description", data.description);
}
