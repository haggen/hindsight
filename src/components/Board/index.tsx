import { type ReactNode, useState } from "react";
import { Link, useRoute } from "wouter";
import { Button } from "~/components/Button";
import { Footer } from "~/components/Footer";
import { Icon } from "~/components/Icon";
import { useBoard, useParticipantIds, useSortedCardIds } from "~/lib/data";
import { useStore } from "~/lib/store";
import { useInterval } from "~/lib/useInterval";

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
        className="px-4 py-2 font-mono text-white rounded-3xl bg-stone-400"
      >
        --:--
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 font-mono text-white rounded-3xl bg-lime-600"
    >
      {format(value)}
    </button>
  );
}

export function Timer() {
  const store = useStore();
  const { timer = 0 } = useBoard();
  const [active, setActive] = useState(timer > Date.now());

  useInterval(() => {
    setActive(timer > Date.now());

    // To trigger the notification, the timer must be active, greater than 0 (meaning it has been set) and in the past.
    // Since we updated the state above, next time it ticks `active` will be false and we'll avoid
    if (active && timer > 0 && Date.now() > timer) {
      new Notification("Time is up!");
    }
  }, 200);

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

function Pagination() {
  const [presenting, params] = useRoute<{
    cardId: string;
  }>("/cards/:cardId");
  const [finished] = useRoute("/finished");
  const cardIds = useSortedCardIds();
  const cardId = params?.cardId ?? "";
  const index = cardIds.indexOf(cardId);
  const hasPrev = index === 0;
  const hasNext = index === cardIds.length - 1;
  const prevIndex = Math.max(0, index - 1);
  const nextIndex = Math.min(cardIds.length - 1, index + 1);

  return (
    <div className="flex items-center justify-end grow">
      {presenting || finished ? (
        <menu className="flex items-center gap-3">
          <li>
            <Button
              href={
                finished
                  ? `/cards/${cardIds[cardIds.length - 1]}`
                  : hasPrev
                    ? "/"
                    : `/cards/${cardIds[prevIndex]}`
              }
            >
              <Icon symbol="arrow-left" /> Back
            </Button>
          </li>
          <li>
            <Button
              href={hasNext ? "/finished" : `/cards/${cardIds[nextIndex]}`}
              disabled={finished}
            >
              Next <Icon symbol="arrow-right" />
            </Button>
          </li>
        </menu>
      ) : (
        <menu className="flex items-center gap-3">
          <li>
            <Button
              href={`/cards/${cardIds[0]}`}
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
    <div className="flex items-center gap-1">
      <Icon
        symbol="user-square"
        className="text-2xl"
        label={`${participantIds.length} people connected.`}
      />
      ×{participantIds.length}
    </div>
  );
}

type BoardProps = {
  children: ReactNode;
};

export function Board({ children }: BoardProps) {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] px-6 h-dvh">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-12 h-24">
        <div className="flex items-center justify-between grow">
          <h1 className="text-2xl font-black">
            <Link href="~/">Hindsight</Link>
          </h1>

          <Audience />
        </div>

        <Timer />

        <Pagination />
      </div>

      <div className="overflow-auto grow">{children}</div>

      <Footer />
    </div>
  );
}
