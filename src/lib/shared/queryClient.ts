import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let queryClient: QueryClient;

export function getQueryClient() {
  // On the server we always need a fresh queryClient.
  if (isServer) {
    return createQueryClient();
  }

  // On the client we should have a single queryClient.
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
}
