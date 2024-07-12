import { createLocalPersister } from "tinybase/persisters/persister-browser/with-schemas";
import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  createIndexes,
  createMergeableStore,
  createMetrics,
  createQueries,
  createRelationships,
} from "tinybase/with-schemas";

const valuesSchema = {} as const;

const tablesSchema = {
  boards: {
    countdown: { type: "number" },
  },
  participants: {
    boardId: { type: "string" },
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

export type Schema = [typeof tablesSchema, typeof valuesSchema];

export const store = createMergeableStore()
  .setValuesSchema(valuesSchema)
  .setTablesSchema(tablesSchema);

// ---

const TypedUiReact = UiReact as UiReact.WithSchemas<Schema>;

export { TypedUiReact as UiReact };

// ---

export const queries = createQueries(store);

// ---

export const metrics = createMetrics(store);

// ---

export const relationships = createRelationships(store);

// ---

export const indexes = createIndexes(store);

indexes.setIndexDefinition("votesByCardId", "votes", "cardId");
indexes.setIndexDefinition("cardsByColumnId", "cards", "columnId");
indexes.setIndexDefinition("columnsByBoardId", "columns", "boardId");
indexes.setIndexDefinition("participantsByBoardId", "participants", "boardId");

// ---

export const persister = createLocalPersister(store, "store");

await persister.startAutoLoad();
await persister.startAutoSave();
