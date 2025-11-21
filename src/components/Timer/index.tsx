import { AlarmClockOffIcon, AlarmClockPlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/Button";
import { useBoard } from "~/lib/data";
import { useStore } from "~/lib/store";
import { createStyles } from "~/lib/styles";
import { useInterval } from "~/lib/useInterval";

function format(timestamp: number) {
  const delta = Math.ceil((timestamp - Date.now()) / 1000);

  const m = Math.floor(delta / 60);
  const s = delta % 60;

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const displayStyle = createStyles(
  "px-4 h-10 font-mono text-white rounded-full",
  {
    active: {
      true: "bg-lime-600 ",
      false: "bg-stone-600 ",
    },
  },
);

type DisplayProps = {
  onClick: () => void;
  value: number;
};

function Display({ value, onClick }: DisplayProps) {
  const [, update] = useState({});

  useInterval(() => {
    update({});
  }, 50);

  const active = value > Date.now();

  return (
    <button
      type="button"
      onClick={onClick}
      className={displayStyle({ active })}
    >
      {active ? format(value) : "--:--"}
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

  // Time increment.
  const increment = 5 * 60 * 1000;

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => handleChange(Math.max(Date.now(), timer) + increment)}
      >
        <AlarmClockPlusIcon />
      </Button>

      <Display value={timer} onClick={handleNotifRequest} />
      <Button onClick={() => handleChange(0)} disabled={!active}>
        <AlarmClockOffIcon />
      </Button>
    </div>
  );
}
