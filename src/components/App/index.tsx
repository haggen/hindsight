import { Route, Switch } from "wouter";
import { UiReact, indexes, metrics, relationships, store } from "~/lib/store";
import Missing from "~/pages/404";
import Board from "~/pages/Board";
import Boards from "~/pages/Boards";
import Card from "~/pages/Card";
import Finished from "~/pages/Finished";
import Welcome from "~/pages/Welcome";

export function App() {
  return (
    <UiReact.Provider
      store={store}
      relationships={relationships}
      metrics={metrics}
      indexes={indexes}
    >
      <div className="container mx-auto py-6 ">
        <Switch>
          <Route path="/" component={Welcome} />
          <Route path="/boards" component={Boards} />
          <Route path="/boards/:boardId" component={Board} />
          <Route path="/boards/:boardId/cards/:cardId" component={Card} />
          <Route path="/boards/:boardId/finished" component={Finished} />
          <Route component={Missing} />
        </Switch>
      </div>
    </UiReact.Provider>
  );
}
