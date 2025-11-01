import { type ReactNode, useEffect } from "react";
import { createLocalPersister } from "tinybase/persisters/persister-browser/with-schemas";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client/with-schemas";
import { getParticipantId } from "~/lib/participantId";

import { UiReact, useCreateContext } from "~/lib/store";
import { useAsyncEffect } from "~/lib/useAsyncEffect";

type Props = {
  boardId: string;
  children: ReactNode;
};

export function Provider({ boardId, children }: Props) {
  const participantId = getParticipantId();
  const context = useCreateContext();

  useAsyncEffect(async () => {
    const webSocket = await new Promise<WebSocket>((resolve, reject) => {
      const webSocket = new WebSocket(
        `wss://tinysync.crz.li/hindsight/${boardId}`,
      );
      webSocket.addEventListener("open", () => {
        resolve(webSocket);
      });
      webSocket.addEventListener("error", (event) => {
        reject(event);
      });
    });

    const synchronizer = await createWsSynchronizer(context.store, webSocket);
    await synchronizer.startSync();

    const persister = createLocalPersister(context.store, boardId);
    await persister.load();
    await persister.startAutoSave();

    context.store.setRow("participants", participantId, {});

    return () => {
      persister.destroy();
      synchronizer.destroy();
      webSocket.close();
    };
  }, [context.store, boardId, participantId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      switch (document.visibilityState) {
        case "visible":
          context.store.setRow("participants", participantId, {});
          break;
        case "hidden":
          context.store.delRow("participants", participantId);
          break;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [context.store, participantId]);

  return (
    <UiReact.Provider
      store={context.store}
      relationships={context.relationships}
      queries={context.queries}
      metrics={context.metrics}
      indexes={context.indexes}
    >
      {children}
    </UiReact.Provider>
  );
}
