import { createLocalPersister } from "tinybase/persisters/persister-browser/with-schemas";
import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  createIndexes,
  createMergeableStore,
  createMetrics,
  createQueries,
  createRelationships,
} from "tinybase/with-schemas";
import "ws";

const valuesSchema = {} as const;

const tablesSchema = {
  boards: {
    countdown: { type: "number" },
  },
  participants: {
    boardId: { type: "string", default: "" },
  },
  columns: {
    boardId: { type: "string", default: "" },
    createdAt: { type: "number", default: 0 },
    description: { type: "string", default: "" },
  },
  cards: {
    boardId: { type: "string", default: "" },
    columnId: { type: "string", default: "" },
    authorId: { type: "string", default: "" },
    createdAt: { type: "number", default: 0 },
    description: { type: "string", default: "" },
  },
  votes: {
    boardId: { type: "string", default: "" },
    cardId: { type: "string", default: "" },
    voterId: { type: "string", default: "" },
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
indexes.setIndexDefinition("votesByBoardId", "votes", "boardId");
indexes.setIndexDefinition("columnsByBoardId", "columns", "boardId");
indexes.setIndexDefinition("participantsByBoardId", "participants", "boardId");
indexes.setIndexDefinition("cardsByColumnId", "cards", "columnId");
indexes.setIndexDefinition("cardsByBoardId", "cards", "boardId");

// ---

export const persister = createLocalPersister(store, "store");

// await persister.startAutoLoad();
// await persister.startAutoSave();
