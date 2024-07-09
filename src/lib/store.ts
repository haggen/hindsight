import {
  createMergeableStore,
  type NoValuesSchema,
} from "tinybase/with-schemas";
import * as UiReact from "tinybase/ui-react/with-schemas";
import { createLocalPersister } from "tinybase/persisters/persister-browser";

const tablesSchema = {
  boards: {
    timer: { type: "number" },
  },
  users: {
    name: { type: "string" },
  },
  columns: {
    boardId: { type: "string" },
    description: { type: "string" },
  },
  cards: {
    authorId: { type: "string" },
    columnId: { type: "string" },
    description: { type: "string" },
  },
  votes: {
    cardId: { type: "string" },
    voterId: { type: "string" },
  },
} as const;

export const store =
  createMergeableStore("hindsight").setTablesSchema(tablesSchema);

export const { useTable, useRow } = UiReact as UiReact.WithSchemas<
  [typeof tablesSchema, NoValuesSchema]
>;

export const persister = createLocalPersister(store, "store");

await persister.startAutoLoad();
await persister.startAutoSave();
