import { Middleware, Dispatch, MiddlewareAPI } from "redux";

import { Action } from "src/types";
import { State } from "src/store";

const broadcastables = [
  "cards/create",
  "cards/vote",
  "cards/delete",
  "board/clear",
];

let webSocket: WebSocket;

export const multiplayer: Middleware =
  (api: MiddlewareAPI<Dispatch, State>) => (next) => (action: Action) => {
    next(action);

    if (action.type === "ostrich/connect") {
      if (webSocket) {
        webSocket.close();
      }

      webSocket = new WebSocket(
        `ws://web-ostrich.localhost/hindsight/b/${action.payload.boardId}`
      );

      webSocket.addEventListener("message", ({ data }) => {
        api.dispatch(JSON.parse(data));
      });
    }

    if (webSocket?.readyState !== WebSocket.OPEN) {
      return;
    }

    if (action.type === "ostrich/sync/request") {
      const {
        board: { id },
        cards,
        columns,
      } = api.getState();
      webSocket.send(
        JSON.stringify({
          type: "ostrich/sync/reply",
          payload: { id, cards, columns },
        })
      );
    }

    if (action.meta?.remote) {
      return;
    }

    if (broadcastables.includes(action.type)) {
      webSocket.send(JSON.stringify(action));
    }
  };
