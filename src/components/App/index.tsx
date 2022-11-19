import * as style from "./style.module.css";

export function App() {
  return (
    <div className={style.layout}>
      <nav className={style.menu}>
        <h1>
          <a href="/">Hindsight</a>
        </h1>
      </nav>
      <main className={style.main}>...</main>
      <footer className={style.footer}>
        <p>©️ 2022 Hindsight</p>
      </footer>
    </div>
  );
}
