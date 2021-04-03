import { Button } from "src/components/button";

import style from "./style.module.css";

export const Footer = () => {
  return (
    <footer className={style.footer}>
      <p>Copr. 2020 Arthur Corenzan.</p>

      <ul className={style.menu}>
        <li>
          <Button
            tag="a"
            href="https://github.com/haggen/hindsight"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </Button>
        </li>
        <li>
          <Button
            tag="a"
            href="https://github.com/haggen/hindsight/issues"
            target="_blank"
            rel="noreferrer"
          >
            Feedback
          </Button>
        </li>
        <li>
          <Button
            tag="a"
            href="https://github.com/haggen/hindsight/discussions"
            target="_blank"
            rel="noreferrer"
          >
            Help
          </Button>
        </li>
      </ul>
    </footer>
  );
};
