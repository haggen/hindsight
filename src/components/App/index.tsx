import { nanoid } from "nanoid";
import { Switch, Route, useLocation } from "wouter";

import { Route as Board } from "~/src/routes/Board";
import { Route as Entry } from "~/src/routes/Entry";

function createBoardId() {
  return nanoid(6);
}

export function App() {
  const [location, setLocation] = useLocation();

  if (location === "/") {
    setLocation(`/${createBoardId()}`, { replace: true });
  }

  return (
    <Switch>
      <Route path="/:boardId" component={Board} />
      <Route path="/:boardId/:entryId" component={Entry} />
    </Switch>
  );
}
