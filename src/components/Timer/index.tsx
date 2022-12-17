import { useEffect, useState } from "react";

import * as style from "./style.module.css";

import { Button } from "~/src/components/Button";
import { SharedState, useSharedMap } from "~/src/lib/data";
import { ClassList } from "~/src/lib/classList";

function format(target: number) {
  const elapsed = target - Date.now();
  const minutes = Math.floor(elapsed / 60000).toString();
  const seconds = Math.floor((elapsed % 60000) / 1000).toString();

  if (elapsed < 0) {
    return "00:00";
  }
  return `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
}

function Display({ target }: { target: number }) {
  const [text, setText] = useState("00:00");

  useEffect(() => {
    const id = setInterval(() => {
      setText(format(target));
    }, 100);
    return () => {
      clearInterval(id);
    };
  }, [target]);

  return <output>{text}</output>;
}

type Timer = {
  target: number;
};

export function Timer() {
  const [{ target = 0 }, mutate] = useSharedMap<Timer>(SharedState.Timer);

  const enabled = target > Date.now();

  const handleAddFive = () =>
    mutate((map) => {
      map.set("target", Math.max(target, Date.now()) + 1000 * 60 * 5);
    });

  const handleReset = () =>
    mutate((map) => {
      map.set("target", Date.now());
    });

  const classList = new ClassList();
  classList.add(style.timer);
  if (enabled) {
    classList.add(style.active);
  }

  return (
    <aside className={classList.toString()}>
      <menu>
        <li>
          <Button onClick={handleReset} color="negative" disabled={!enabled}>
            Clear
          </Button>
        </li>
        <li>
          <Button onClick={handleAddFive}>+5 min.</Button>
        </li>
      </menu>
      <Display target={target} />
    </aside>
  );
}
