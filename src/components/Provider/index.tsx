import type { ReactNode } from "react";
import { createLocalPersister } from "tinybase/persisters/persister-browser/with-schemas";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client/with-schemas";
import { createId } from "~/lib/createId";
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
    const id = createId();

    console.log(`Effect ${id}`);

    const persister = createLocalPersister(context.store, boardId);
    await persister.load();
    await persister.startAutoSave();

    const webSocket = await new Promise<WebSocket>((resolve) => {
      const webSocket = new WebSocket(
        `wss://tinysync.crz.li/hindsight/${boardId}`,
      );
      webSocket.addEventListener("open", () => {
        resolve(webSocket);
      });
    });

    const synchronizer = await createWsSynchronizer(context.store, webSocket);
    await synchronizer.startSync();

    context.store.setRow("participants", participantId, {});

    return async () => {
      console.log(`Clean up ${id}`);

      context.store.delRow("participants", participantId);
      synchronizer.destroy();
      webSocket.close();
      persister.destroy();
    };
  }, [context.store, boardId, participantId]);

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
