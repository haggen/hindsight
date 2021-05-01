import { Route, Switch } from "wouter";

import { Header } from "src/components/header";
import { Start } from "src/components/start";
import { NotFound } from "src/components/not-found";
import { Board } from "src/components/board";
import { Footer } from "src/components/footer";
import { Provider as BoardProvider } from "src/components/board/state";
import { Provider as ProfileProvider } from "src/components/profile";
import { Provider as TooltipProvider } from "src/components/tooltip";

import style from "./style.module.css";

export const App = () => {
  return (
    <TooltipProvider>
      <ProfileProvider>
        <BoardProvider>
          <div className={style.layout}>
            <div className={style.header}>
              <Header />
            </div>
            <main className={style.main}>
              <Switch>
                <Route path="/">
                  <Start />
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
      </ProfileProvider>
    </TooltipProvider>
  );
};
