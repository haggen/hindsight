import { type ReactNode, useState } from "react";
import { Link, useRoute } from "wouter";
import { Button } from "~/components/Button";
import { Footer } from "~/components/Footer";
import { Icon } from "~/components/Icon";
import { Provider } from "~/components/Provider";
import { store } from "~/lib/store";
import { useBoard } from "~/lib/useBoard";
import { useSortedCardIds } from "~/lib/useCardIds";
import { useInterval } from "~/lib/useInterval";
import { useParticipantIds } from "~/lib/useParticipantIds";

function format(timestamp: number) {
  const delta = Math.ceil((timestamp - Date.now()) / 1000);

  const m = Math.floor(delta / 60);
  const s = delta % 60;

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type DisplayProps = {
  onClick: () => void;
  value: number;
};

function Display({ value, onClick }: DisplayProps) {
  const [, update] = useState({});

  useInterval(() => {
    update({});
  }, 50);

  if (value < Date.now()) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="font-mono text-lg text-white px-4 py-2 rounded-3xl bg-stone-400"
      >
        00:00
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-lg text-white px-4 py-2 rounded-3xl bg-lime-600"
    >
      {format(value)}
    </button>
  );
}

export function Timer() {
  const { timer } = useBoard();
  const [active, setActive] = useState(timer > Date.now());

  useInterval(() => {
    setActive(timer > Date.now());

    if (active && timer > 0 && Date.now() > timer) {
      new Notification("Time is up!");
    }
  }, 50);

  const handleNotifRequest = () => {
    Notification.requestPermission();
  };

  const handleChange = (value: number) => {
    store.setValue("timer", value);
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="negative"
        onClick={() => handleChange(0)}
        disabled={!active}
      >
        Clear
      </Button>

      <Display value={timer} onClick={handleNotifRequest} />

      <Button
        onClick={() =>
          handleChange(Math.max(Date.now(), timer) + 5 * 60 * 1000)
        }
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
  const [finished] = useRoute("/boards/:boardId/finished");
  const cardIds = useSortedCardIds();
  const cardId = params?.cardId ?? "";
  const index = cardIds.indexOf(cardId);
  const hasPrev = index === 0;
  const hasNext = index === cardIds.length - 1;
  const prevIndex = Math.max(0, index - 1);
  const nextIndex = Math.min(cardIds.length - 1, index + 1);

  return (
    <div className="flex flex-grow items-center justify-end">
      {presenting || finished ? (
        <menu className="flex items-center gap-3">
          <li>
            <Button
              href={
                finished
                  ? `/boards/${boardId}/cards/${cardIds[cardIds.length - 1]}`
                  : hasPrev
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
                hasNext
                  ? `/boards/${boardId}/finished`
                  : `/boards/${boardId}/cards/${cardIds[nextIndex]}`
              }
              disabled={finished}
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

function Audience() {
  const participantIds = useParticipantIds();

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`${participantIds.length} people connected.`}
    >
      <Icon symbol="user-square" className="text-2xl" />×{participantIds.length}
    </div>
  );
}

type BoardProps = {
  boardId: string;
  children: ReactNode;
};

export function Board({ boardId, children }: BoardProps) {
  return (
    <Provider boardId={boardId}>
      <div className="flex flex-col px-6 h-dvh">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-12 h-24">
          <div className="flex items-center flex-grow justify-between">
            <h1 className="text-2xl font-black">
              <Link href="/">Hindsight</Link>
            </h1>

            <Audience />
          </div>

          <Timer />

          <Pagination boardId={boardId} />
        </div>

        <div className="overflow-auto grow">{children}</div>

        <Footer />
      </div>
    </Provider>
  );
}
