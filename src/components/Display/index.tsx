import { useCallback, useLayoutEffect, useRef } from "react";

import * as style from "./style.module.css";

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

type Props = {
  target: number;
  active?: boolean;
};

export function Display({ target, active = false }: Props) {
  const elementRef = useRef<HTMLOutputElement>(null);
  const mountRef = useRef(false);
  const rafRef = useRef(0);

  const update = useCallback(() => {
    if (elementRef.current) {
      elementRef.current.textContent = format(target);
    }
    if (mountRef.current) {
      rafRef.current = requestAnimationFrame(update);
    }
  }, [target]);

  useLayoutEffect(() => {
    mountRef.current = true;
    rafRef.current = requestAnimationFrame(update);
    return () => {
      mountRef.current = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [update]);

  const classList = new ClassList();
  classList.add(style.display);
  if (active) {
    classList.add(style.active);
  }

  return <output ref={elementRef} className={classList.toString()} />;
}
