import { Route, Switch } from "wouter";

import { Header } from "src/components/header";
import { Home } from "src/components/home";
import { NotFound } from "src/components/not-found";
import { Board } from "src/components/board";
import { Footer } from "src/components/footer";
import { Provider as BoardProvider } from "src/lib/board";
import { Provider as CurrentUserProvider } from "src/lib/current-user";

import style from "./style.module.css";

export const App = () => {
  return (
    <CurrentUserProvider>
      <BoardProvider>
        <div className={style.layout}>
          <div className={style.header}>
            <Header />
          </div>
          <main className={style.main}>
            <Switch>
              <Route path="/">
                <Home />
              </Route>
              <Route path="/b/:id">
                {(params) => <Board id={params.id} />}
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </main>
          <div className={style.footer}>
            <Footer />
          </div>
        </div>
      </BoardProvider>
    </CurrentUserProvider>
  );
};
