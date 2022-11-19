import { useOthers } from "~/src/lib/liveblocks";

import * as style from "./style.module.css";

export function Layout({ children }) {
  const others = useOthers();

  return (
    <div className={style.layout}>
      <nav className={style.menu}>
        <h1>
          <a href="/">Hindsight</a>
        </h1>

        <p>00:00</p>

        <ul>
          {others.map((other) => (
            <li key={other.id}>👤</li>
          ))}
        </ul>
      </nav>
      <main className={style.main}>{children}</main>
      <footer className={style.footer}>
        <p>©️ 2022 Hindsight</p>
      </footer>
    </div>
  );
}
