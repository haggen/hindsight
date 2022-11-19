import { Suspense } from "react";
import { Board } from "~/src/components/Board";
import { Layout } from "~/src/components/Layout";
import { RoomProvider } from "~/src/lib/liveblocks";

export function Route({ params }) {
  return (
    <RoomProvider id={params.boardId} initialPresence={{}}>
      <Suspense fallback="Loading…">
        <Layout>
          <Board id={params.boardId} />
        </Layout>
      </Suspense>
    </RoomProvider>
  );
}
