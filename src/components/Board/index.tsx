import { type ReactNode, useEffect, useState } from "react";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client/with-schemas";
import { Link, useRoute } from "wouter";
import { Button } from "~/components/Button";
import { Footer } from "~/components/Footer";
import { Icon } from "~/components/Icon";
import { getParticipantId } from "~/lib/participantId";
import { UiReact, store } from "~/lib/store";
import { useBoard } from "~/lib/useBoard";
import { useSortedCardIdsByBoardId } from "~/lib/useCardIds";
import { useParticipantIds } from "~/lib/useParticipantIds";

function format(timestamp: number) {
  const delta = Math.ceil((timestamp - Date.now()) / 1000);

  const m = Math.floor(delta / 60);
  const s = delta % 60;

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type DisplayProps = {
  value: number;
};

function Display({ value }: DisplayProps) {
  const [, update] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      update({});
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (value < Date.now()) {
    return (
      <span className="font-mono text-lg text-white px-4 py-2 rounded-3xl bg-stone-600">
        00:00
      </span>
    );
  }

  return (
    <span className="font-mono text-lg text-white px-4 py-2 rounded-3xl bg-lime-600">
      {format(value)}
    </span>
  );
}

type CountdownProps = {
  value: number;
  onChange: (value: number) => void;
};

export function Countdown({ value, onChange }: CountdownProps) {
  return (
    <div className="flex items-center gap-3">
      <Button variant="negative" onClick={() => onChange(0)} disabled={!value}>
        Clear
      </Button>

      <Display value={value} />

      <Button
        onClick={() => onChange(Math.max(Date.now(), value) + 5 * 60 * 1000)}
      >
        +5 min.
      </Button>
    </div>
  );
}

type PaginationProps = {
  boardId: string;
};

function Pagination({ boardId }: PaginationProps) {
  const [presenting, params] = useRoute<{
    cardId: string;
  }>("/boards/:boardId/cards/:cardId");
  const [isFinished] = useRoute("/boards/:boardId/finished");
  const cardIds = useSortedCardIdsByBoardId(boardId);
  const cardId = params?.cardId ?? "";
  const index = cardIds.indexOf(cardId);
  const isFirst = index === 0;
  const isLast = index === cardIds.length - 1;
  const prevIndex = Math.max(0, index - 1);
  const nextIndex = Math.min(cardIds.length - 1, index + 1);

  return (
    <div className="flex flex-grow items-center justify-end">
      {presenting || isFinished ? (
        <menu className="flex items-center gap-3">
          <li>
            <Button
              href={
                isFinished
                  ? `/boards/${boardId}/cards/${cardIds[cardIds.length - 1]}`
                  : isFirst
                    ? `/boards/${boardId}`
                    : `/boards/${boardId}/cards/${cardIds[prevIndex]}`
              }
            >
              <Icon symbol="arrow-left" /> Back
            </Button>
          </li>
          <li>
            <Button
              href={
                isLast
                  ? `/boards/${boardId}/finished`
                  : `/boards/${boardId}/cards/${cardIds[nextIndex]}`
              }
              disabled={isFinished}
            >
              Next <Icon symbol="arrow-right" />
            </Button>
          </li>
        </menu>
      ) : (
        <menu>
          <li>
            <Button
              href={`/boards/${boardId}/cards/${cardIds[0]}`}
              disabled={cardIds.length === 0}
            >
              Start reading <Icon symbol="arrow-right" />
            </Button>
          </li>
        </menu>
      )}
    </div>
  );
}

type BoardProps = {
  boardId: string;
  children: ReactNode;
};

export function Board({ boardId, children }: BoardProps) {
  const { countdown } = useBoard(boardId);
  const participantIds = useParticipantIds(boardId);
  const participantId = getParticipantId();

  UiReact.useCreateSynchronizer(
    store,
    async (store) => {
      const synchronizer = await createWsSynchronizer(
        store,
        new WebSocket(
          `wss://tinybase-synchronizer.crz.li/hindsight/${boardId}`,
        ),
      );
      await synchronizer.startSync();
      return synchronizer;
    },
    [boardId],
  );

  useEffect(() => {
    store.setRow("participants", participantId, { boardId });

    const handleVisibilityChange = () => {
      switch (document.visibilityState) {
        case "visible":
          store.setRow("participants", participantId, { boardId });
          break;
        case "hidden":
          store.delRow("participants", participantId);
          break;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      store.delRow("participants", participantId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [boardId, participantId]);

  const handleCountdownChange = (value: number) => {
    store.setCell("boards", boardId, "countdown", value);
  };

  return (
    <div className="flex flex-col px-6 h-dvh">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-12 h-24">
        <div className="flex items-center flex-grow justify-between">
          <h1 className="text-2xl font-black">
            <Link href="/">Hindsight</Link>
          </h1>

          <div
            className="flex items-center gap-1"
            aria-label={`${participantIds.length} people connected.`}
          >
            <Icon symbol="user-square" className="text-2xl" />×
            {participantIds.length}
          </div>
        </div>

        <Countdown value={countdown ?? 0} onChange={handleCountdownChange} />

        <Pagination boardId={boardId} />
      </div>

      <div className="overflow-auto grow">{children}</div>

      <Footer />
    </div>
  );
}
