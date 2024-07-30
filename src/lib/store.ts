import { useMemo } from "react";
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

const TypedUiReact = UiReact as UiReact.WithSchemas<Schema>;

export { TypedUiReact as UiReact };

export function useCreateContext() {
  const store = useMemo(
    () =>
      createMergeableStore()
        .setValuesSchema(schema.values)
        .setTablesSchema(schema.tables),
    [],
  );

  const relationships = useMemo(() => createRelationships(store), [store]);
  const queries = useMemo(() => createQueries(store), [store]);
  const metrics = useMemo(() => createMetrics(store), [store]);
  const indexes = useMemo(() => createIndexes(store), [store]);

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

  indexes.setIndexDefinition("votesByCardId", "votes", "cardId");
  indexes.setIndexDefinition("cardsByColumnId", "cards", "columnId");

  return { store, relationships, queries, metrics, indexes } as const;
}

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

export function useStoreContext() {
  const store = useStore();
  const relationships = useRelationships();
  const queries = useQueries();
  const metrics = useMetrics();
  const indexes = useIndexes();

  return { store, relationships, queries, metrics, indexes } as const;
}

export type Context = ReturnType<typeof useStoreContext>;
