import { type ReactNode, useEffect, useState } from "react";
import { createLocalPersister } from "tinybase/persisters/persister-browser/with-schemas";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client/with-schemas";
import { getParticipantId } from "~/lib/participantId";
import { createContext, TypedUiReact } from "~/lib/store";
import { useAsyncEffect } from "~/lib/useAsyncEffect";

type Props = {
  boardId: string;
  children: ReactNode;
};

export function Provider({ boardId, children }: Props) {
  const participantId = getParticipantId();
  const [context] = useState(() => createContext());

  useAsyncEffect(async () => {
    const webSocket = new WebSocket(
      `wss://tinysync.crz.li/hindsight/${boardId}`,
    );

    const synchronizer = await createWsSynchronizer(context.store, webSocket);
    await synchronizer.startSync();

    const persister = createLocalPersister(context.store, boardId);
    await persister.startAutoPersisting();

    context.store.setCell("participants", participantId, "present", true);

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
          context.store.setCell("participants", participantId, "present", true);
          break;
        case "hidden":
          context.store.setCell(
            "participants",
            participantId,
            "present",
            false,
          );
          break;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [context.store, participantId]);

  return (
    <TypedUiReact.Provider
      store={context.store}
      relationships={context.relationships}
      queries={context.queries}
      metrics={context.metrics}
      indexes={context.indexes}
    >
      {children}
    </TypedUiReact.Provider>
  );
}
