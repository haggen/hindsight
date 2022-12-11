import { useEffect, useState } from "react";

import * as style from "./style.module.css";

import { Button } from "~/src/components/Button";
import { useSharedState } from "~/src/lib/data";

function Display({ target }: { target: number }) {
  const [text, setText] = useState("00:00");

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = target - Date.now();
      const minutes = Math.floor(elapsed / 60_000).toString();
      const seconds = Math.floor((elapsed % 60_000) / 1000).toString();
      setText(
        elapsed < 0
          ? "00:00"
          : `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`
      );
    }, 100);
    return () => {
      clearInterval(id);
    };
  }, [target]);

  return <output>{text}</output>;
}

export function Timer() {
  const [state, mutate] = useSharedState();

  const value = state.timer;

  const setValue = (value: number) => {
    mutate((state) => {
      state.set("timer", value);
    });
  };

  const handleAddFive = () => {
    setValue(Math.max(value, Date.now()) + 1000 * 60 * 5);
  };

  const handleReset = () => {
    setValue(Date.now());
  };

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
      <Display target={value} />
    </aside>
  );
}
