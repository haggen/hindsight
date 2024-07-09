import { Route, Switch } from "wouter";
import Board from "~/pages/Board";
import Boards from "~/pages/Boards";
import Card from "~/pages/Card";
import Welcome from "~/pages/Welcome";
import Missing from "~/pages/404";

export function App() {
  return (
    <div class="container mx-auto py-6 ">
      <Switch>
        <Route path="/" component={Welcome} />
        <Route path="/boards" component={Boards} />
        <Route path="/boards/:boardId" component={Board} />
        <Route path="/boards/:boardId/cards/:cardId" component={Card} />
        <Route component={Missing} />
      </Switch>
    </div>
  );
}
