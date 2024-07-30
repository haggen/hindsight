import { Route, Switch } from "wouter";
import { Provider } from "~/components/Provider";
import NotFound from "~/pages/404";
import Board from "~/pages/Board";
import Boards from "~/pages/Boards";
import Card from "~/pages/Card";
import Finished from "~/pages/Finished";
import Home from "~/pages/Home";

export function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/boards" component={Boards} />
      <Route path="/boards/:boardId" nest>
        {(params) => (
          <Provider boardId={params.boardId}>
            <Route path="/" component={Board} />
            <Route path="/cards/:cardId" component={Card} />
            <Route path="/finished" component={Finished} />
          </Provider>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}
