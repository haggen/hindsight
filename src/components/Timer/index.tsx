import { useEffect, useState } from "react";

import { useMutation, useStorage } from "~/src/lib/liveblocks";
import { Button } from "~/src/components/Button";

import * as style from "./style.module.css";

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
          : `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`,
      );
    }, 100);
    return () => {
      clearInterval(id);
    };
  }, [target]);

  return <output>{text}</output>;
}

export function Timer() {
  const setValue = useMutation(({ storage }, value: number) => {
    storage.set("timer", value);
  }, []);

  const value = useStorage(({ timer }) => timer);

  const handleAddFive = () => {
    setValue(Math.max(value, Date.now()) + 1000 * 60 * 5);
  };

  const handleReset = () => {
    setValue(Date.now());
  };

  return (
    <aside className={style.timer}>
      <Display target={value} />
      <menu>
        <li>
          <Button onClick={handleAddFive}>+5</Button>
        </li>
        <li>
          <Button onClick={handleReset}>Reset</Button>
        </li>
      </menu>
    </aside>
  );
}
