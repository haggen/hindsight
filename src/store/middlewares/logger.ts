import { Middleware, MiddlewareAPI, Dispatch } from "redux";

import { Action } from "src/types";
import { State } from "src/store";

export const logger: Middleware =
  (api: MiddlewareAPI<Dispatch, State>) => (next) => (action: Action) => {
    console.log("action", action);
    next(action);
  };
