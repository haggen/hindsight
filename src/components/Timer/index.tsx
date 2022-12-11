import { useEffect, useState } from "react";

import * as style from "./style.module.css";

import { Button } from "~/src/components/Button";
import { useSharedMap } from "~/src/lib/data";

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
      setText(format(target - Date.now()));
    }, 100);
    return () => {
      clearInterval(id);
    };
  }, [target]);

  return <output>{text}</output>;
}

export function Timer() {
  const [snapshot, mutate] = useSharedMap("timer", { target: 0 });

  const target = snapshot.target;

  const handleAddFive = () =>
    mutate((map) => {
      map.set("target", Math.max(target, Date.now()) + 1000 * 60 * 5);
    });

  const handleReset = () =>
    mutate((map) => {
      map.set("target", Date.now());
    });

  return (
    <aside className={style.timer}>
      <menu>
        <li>
          <Button onClick={handleReset}>Reset</Button>
        </li>
        <li>
          <Button onClick={handleAddFive}>+5 min.</Button>
        </li>
      </menu>
      <Display target={target} />
    </aside>
  );
}
