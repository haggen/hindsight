import { Route, Switch } from "wouter";
import { Provider as StoreProvider } from "react-redux";

import { Header } from "src/components/header";
import { Start } from "src/components/start";
import { NotFound } from "src/components/not-found";
import { Board } from "src/components/board";
import { Footer } from "src/components/footer";
import { Provider as TooltipProvider } from "src/components/tooltip";
import { store } from "src/store";

import style from "./style.module.css";

export const App = () => {
  return (
    <StoreProvider store={store}>
      <TooltipProvider>
        <div className={style.layout}>
          <div className={style.header}>
            <Header />
          </div>
          <main className={style.main}>
            <Switch>
              <Route path="/">
                <Start />
              </Route>
              <Route path="/b/:id">{({ id }) => <Board id={id} />}</Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </main>
          <div className={style.footer}>
            <Footer />
          </div>
        </div>
      </TooltipProvider>
    </StoreProvider>
  );
};
