import { type ReactNode, useEffect } from "react";
import { createLocalPersister } from "tinybase/persisters/persister-browser/with-schemas";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client/with-schemas";
import { getParticipantId } from "~/lib/participantId";
import { UiReact, indexes, metrics, relationships, store } from "~/lib/store";
import { useWebSocket } from "~/lib/useWebSocket";

type Props = {
  boardId: string;
  children: ReactNode;
};

export function Provider({ boardId, children }: Props) {
  const participantId = getParticipantId();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Participant need to be re-registered when the board changes.
  useEffect(() => {
    const handleVisibilityChange = () => {
      switch (document.visibilityState) {
        case "visible":
          store.setRow("participants", participantId, {});
          break;
        case "hidden":
          store.delRow("participants", participantId);
          break;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [boardId, participantId]);

  UiReact.useCreatePersister(
    store,
    (store) => createLocalPersister(store, boardId),
    [boardId],
    async (persister) => {
      await persister.startAutoLoad();
      await persister.startAutoSave();

      // Bug: If I set the participant row before the persister, the participants table gets overwriten.
      store.setRow("participants", participantId, {});
    },
  );

  const webSocket = useWebSocket(
    boardId ? `wss://tinybase-synchronizer.crz.li/hindsight/${boardId}` : "",
  );

  UiReact.useCreateSynchronizer(
    store,
    async (store) => {
      if (!webSocket) {
        return;
      }

      const synchronizer = await createWsSynchronizer(store, webSocket);
      synchronizer.startSync();
      return synchronizer;
    },
    [boardId, webSocket],
  );

  if (!webSocket) {
    return null;
  }

  return (
    <UiReact.Provider
      store={store}
      relationships={relationships}
      metrics={metrics}
      indexes={indexes}
    >
      {children}
    </UiReact.Provider>
  );
}
