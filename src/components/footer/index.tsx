import style from "./style.module.css";

export const Footer = () => {
  return (
    <footer className={style.footer}>
      <p>Copr. 2020 Arthur Corenzan.</p>

      <ul className={style.menu}>
        <li>
          <a
            href="https://github.com/haggen/hindsight"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        </li>
        <li>
          <a
            href="https://github.com/haggen/hindsight/issues"
            target="_blank"
            rel="noreferrer"
          >
            Feedback
          </a>
        </li>
        <li>
          <a
            href="https://github.com/haggen/hindsight/discussions"
            target="_blank"
            rel="noreferrer"
          >
            Help
          </a>
        </li>
      </ul>
    </footer>
  );
};
