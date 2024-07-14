import { type ReactNode, useEffect, useState } from "react";
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client/with-schemas";
import { Link, useRoute } from "wouter";
import { Button } from "~/components/Button";
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
              &larr; Back
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
              Next &rarr;
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
              Start reading &rarr;
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
        new WebSocket(`wss://tinybase-synchronizer.crz.li/hindsight/${boardId}`)
      );
      await synchronizer.startSync();
      return synchronizer;
    },
    [boardId]
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
    <div className="flex flex-col gap-6 py-6 h-dvh">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-12">
        <div className="flex items-center flex-grow justify-between">
          <h1 className="text-2xl font-black">
            <Link href="/">Hindsight</Link>
          </h1>

          <span
            className="flex items-center gap-1"
            aria-label={`${participantIds.length} people connected.`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              aria-hidden="true"
            >
              <path d="M16.69 2H8.31C4.67 2 2.5 4.17 2.5 7.81V16.19C2.5 19 3.79 20.93 6.06 21.66C6.72 21.89 7.48 22 8.31 22H16.69C17.52 22 18.28 21.89 18.94 21.66C21.21 20.93 22.5 19 22.5 16.19V7.81C22.5 4.17 20.33 2 16.69 2ZM21 16.19C21 18.33 20.16 19.68 18.47 20.24C17.5 18.33 15.2 16.97 12.5 16.97C9.8 16.97 7.51 18.32 6.53 20.24H6.52C4.85 19.7 4 18.34 4 16.2V7.81C4 4.99 5.49 3.5 8.31 3.5H16.69C19.51 3.5 21 4.99 21 7.81V16.19Z" />
              <path d="M12.502 8C10.522 8 8.922 9.6 8.922 11.58C8.922 13.56 10.522 15.17 12.502 15.17C14.482 15.17 16.082 13.56 16.082 11.58C16.082 9.6 14.482 8 12.502 8Z" />
            </svg>
            ×{participantIds.length}
          </span>
        </div>

        <Countdown value={countdown ?? 0} onChange={handleCountdownChange} />

        <Pagination boardId={boardId} />
      </div>

      <div className="overflow-auto grow">{children}</div>

      <footer className="text-center">
        <p>
          Made by{" "}
          <a
            className="underline"
            href="https://x.com/haggen"
            target="_blank"
            rel="noreferrer"
          >
            me
          </a>
          . Source on{" "}
          <a
            className="underline"
            href="https://github.com/haggen/hindsight"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
