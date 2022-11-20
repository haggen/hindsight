import { useOthers } from "~/src/lib/liveblocks";
import { Timer } from "~/src/components/Timer";

import * as style from "./style.module.css";

export function Layout({ children }) {
  const others = useOthers();

  return (
    <div className={style.layout}>
      <header className={style.menu}>
        <h1>
          <a href="/">Hindsight</a>
        </h1>

        <Timer />

        <ul>
          {others.map((other) => (
            <li key={other.id}>👤</li>
          ))}
        </ul>
      </header>

      <main className={style.main}>{children}</main>

      <footer className={style.footer}>
        <p>©️ 2022 Hindsight</p>
      </footer>
    </div>
  );
}
