import { StrictMode, Suspense } from "react";
import { useLocation, useRoute } from "wouter";

import { RoomProvider } from "~/src/lib/liveblocks";
import { Layout } from "~/src/components/Layout";
import { Board } from "~/src/components/Board";
import { createId, initialPresence, initialStorage } from "~/src/lib/data";
import { Loading } from "../Loading";

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
    <RoomProvider
      id={params.boardId}
      initialPresence={initialPresence}
      initialStorage={initialStorage}
    >
      <Suspense fallback={<Loading />}>
        <Layout>
          <Board />
        </Layout>
      </Suspense>
    </RoomProvider>
  );
}
