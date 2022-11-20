import { useEffect, useState } from "react";
import { useMutation, useStorage } from "~/src/lib/liveblocks";

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
  const setTarget = useMutation(({ storage }, value: number) => {
    storage.set("timerTarget", value);
  }, []);

  const target = useStorage(({ timerTarget }) => timerTarget as number);

  const handleAddFiveClick = () => {
    setTarget(Math.max(target, Date.now()) + 1000 * 60 * 5);
  };

  const handleResetClick = () => {
    setTarget(Date.now());
  };

  return (
    <aside className={style.timer}>
      <Display target={target} />
      <button onClick={handleAddFiveClick}>+5</button>
      <button onClick={handleResetClick}>Reset</button>
    </aside>
  );
}
