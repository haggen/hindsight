import { nanoid } from "nanoid";
import { Switch, Route, useLocation, useRoute } from "wouter";

import { RoomProvider } from "~/src/lib/liveblocks";
import { Layout } from "~/src/components/Layout";
import { Board } from "~/src/components/Board";
import { Entry } from "~/src/components/Entry";

type Params = {
  boardId: string;
  entryId?: string;
};

function createBoardId() {
  return nanoid(6);
}

export function App() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute<Params>("/:boardId/:entryId?");

  if (!match) {
    setLocation(`/${createBoardId()}`, { replace: true });
  }

  return (
    <RoomProvider
      id={params.boardId}
      initialPresence={{}}
      initialStorage={{ timerTarget: 0 }}
    >
      <Layout>
        <Switch>
          <Route path="/:boardId" component={Board} />
          <Route path="/:boardId/:entryId" component={Entry} />
        </Switch>
      </Layout>
    </RoomProvider>
  );
}
