import { useRef } from "react";

import * as classes from "./style.module.css";

import { ClassList } from "~/src/lib/classList";
import { useMount } from "~/src/hooks/useMount";
import { useRaf } from "~/src/hooks/useRaf";

function format(target: number) {
  const elapsed = target - Date.now();
  const minutes = Math.floor(elapsed / 60000).toString();
  const seconds = Math.ceil((elapsed % 60000) / 1000).toString();

  if (elapsed < 0) {
    return "00:00";
  }
  return `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
}

type Props = {
  target: number;
  active: boolean;
};

export function Display({ target, active }: Props) {
  const elementRef = useRef<HTMLOutputElement>(null);
  const mounted = useMount();

  useRaf(() => {
    if (elementRef.current && mounted) {
      elementRef.current.textContent = format(target);
    }
  });

  const classList = new ClassList();
  classList.add(classes.display);
  if (active) {
    classList.add(classes.active);
  }

  return (
    <output
      ref={elementRef}
      className={classList.toString()}
      aria-label="Time left for timer to go off."
      aria-live={active ? "polite" : "off"}
    />
  );
}
