import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  createIndexes,
  createMergeableStore,
  createMetrics,
  createQueries,
  createRelationships,
} from "tinybase/with-schemas";

export const schema = {
  values: {
    timer: { type: "number" },
  },
  tables: {
    participants: {
      name: { type: "string", default: "Anonymous" },
      location: { type: "string", default: "/" },
      present: { type: "boolean", default: false },
    },
    columns: {
      createdAt: { type: "number", default: 0 },
      description: { type: "string", default: "" },
    },
    cards: {
      columnId: { type: "string", default: "" },
      authorId: { type: "string", default: "" },
      createdAt: { type: "number", default: 0 },
      description: { type: "string", default: "" },
    },
    votes: {
      cardId: { type: "string", default: "" },
      voterId: { type: "string", default: "" },
    },
  },
} as const;

export type Schema = [typeof schema.tables, typeof schema.values];

export const TypedUiReact = UiReact as UiReact.WithSchemas<Schema>;

export function createContext() {
  const store = createMergeableStore().setSchema(schema.tables, schema.values);

  const relationships = createRelationships(store);
  const queries = createQueries(store);
  const metrics = createMetrics(store);
  const indexes = createIndexes(store);

  relationships.setRelationshipDefinition(
    "cardsColumn",
    "cards",
    "columns",
    "columnId",
  );

  relationships.setRelationshipDefinition(
    "votesCard",
    "votes",
    "cards",
    "cardId",
  );

  indexes.setIndexDefinition(
    "participantsByLocation",
    "participants",
    "location",
  );
  indexes.setIndexDefinition("votesByCardId", "votes", "cardId");
  indexes.setIndexDefinition("cardsByColumnId", "cards", "columnId");

  return { store, relationships, queries, metrics, indexes } as const;
}

export type Context = ReturnType<typeof useContext>;

export function useStore() {
  const store = TypedUiReact.useStore();
  if (!store) {
    throw new Error(
      "useStore failed. Either we're outside the context or the value is missing.",
    );
  }
  return store;
}

export function useRelationships() {
  const relationships = TypedUiReact.useRelationships();
  if (!relationships) {
    throw new Error(
      "useRelationships failed. Either we're outside the context or the value is missing.",
    );
  }
  return relationships;
}

export function useQueries() {
  const queries = TypedUiReact.useQueries();
  if (!queries) {
    throw new Error(
      "useQueries failed. Either we're outside the context or the value is missing.",
    );
  }
  return queries;
}

export function useMetrics() {
  const metrics = TypedUiReact.useMetrics();
  if (!metrics) {
    throw new Error(
      "useMetrics failed. Either we're outside the context or the value is missing.",
    );
  }
  return metrics;
}

export function useIndexes() {
  const indexes = TypedUiReact.useIndexes();
  if (!indexes) {
    throw new Error(
      "useIndexes failed. Either we're outside the context or the value is missing.",
    );
  }
  return indexes;
}

export function useContext() {
  const store = useStore();
  const relationships = useRelationships();
  const queries = useQueries();
  const metrics = useMetrics();
  const indexes = useIndexes();

  return { store, relationships, queries, metrics, indexes } as const;
}
