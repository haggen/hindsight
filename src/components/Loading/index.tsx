import { Emoji } from "~/src/components/Emoji";

import * as style from "./style.module.css";

export function Loading() {
  return (
    <div className={style.loading} aria-live="polite">
      <h1>
        <Emoji emoji="⌛" />
      </h1>
      <p>Loading…</p>
    </div>
  );
}
