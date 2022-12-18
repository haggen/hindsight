import * as classes from "./style.module.css";

import { Emoji } from "~/src/components/Emoji";

type Props<T extends string> = {
  reaction: T;
  count?: number;
  onClick?: (reaction: T) => void;
};

/**
 * Emoji reaction button with a counter.
 */
export function Reaction<T extends string>({
  reaction,
  count,
  onClick,
}: Props<T>) {
  const handleClick = () => {
    onClick?.(reaction);
  };

  return (
    <button className={classes.reaction} onClick={handleClick}>
      <Emoji emoji={reaction} />
      <small>×{count ?? 0}</small>
    </button>
  );
}
