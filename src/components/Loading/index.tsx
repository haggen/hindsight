import * as classes from "./style.module.css";

import { Emoji } from "~/src/components/Emoji";

export function Loading() {
  return (
    <div className={classes.loading} aria-live="polite">
      <h1>
        <Emoji emoji="⌛" />
      </h1>
      <p>Loading…</p>
    </div>
  );
}
