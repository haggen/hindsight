import { Suspense } from "react";

import { RoomProvider } from "~/src/lib/liveblocks";
import { Entry } from "~/src/components/Entry";
import { Layout } from "~/src/components/Layout";

export function Route({ params }) {
  return (
    <RoomProvider id={params.boardId} initialPresence={{}}>
      <Suspense fallback="Loading…">
        <Layout>
          <Entry id={params.entryId} />
        </Layout>
      </Suspense>
    </RoomProvider>
  );
}
