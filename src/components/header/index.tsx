import copy from "copy-to-clipboard";

import { useBoard } from "src/lib/board";
import { confirm } from "src/lib/confirm";
import { Link } from "wouter";

import style from "./style.module.css";

const { location } = window;

export const Header = () => {
  const [, dispatch] = useBoard();

  const onShare = () => {
    copy(location.href);
  };

  const onClear = () => {
    if (confirm("Are you sure?")) {
      dispatch({ type: "reset" });
    }
  };

  return (
    <header className={style.header}>
      <h1 className={style.brand}>
        <Link href="/">
          <a href=".">Hindsight</a>
        </Link>
      </h1>

      <ul className={style.menu}>
        <li>
          <button onClick={onShare}>Share</button>
        </li>
        <li>
          <button onClick={onClear}>Clear</button>
        </li>
        <li>
          <button>Export</button>
        </li>
      </ul>
    </header>
  );
};
