import { useLocation, useRoute } from "wouter";

import { Layout } from "~/src/components/Layout";
import { createId, Provider } from "~/src/lib/data";
import { Router } from "~/src/components/Router";

type Params = {
  boardId: string;
};

export function App() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute<Params>("/:boardId");

  if (!match) {
    setLocation(`/${createId()}`, { replace: true });
  }

  if (!params) {
    return null;
  }

  return (
    <Provider roomId={params.boardId}>
      <Layout>
        <Router />
      </Layout>
    </Provider>
  );
}
