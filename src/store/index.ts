import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import {
  TypedUseSelectorHook,
  useDispatch as _useDispatch,
  useSelector as _useSelector,
} from "react-redux";

import { profile } from "src/store/reducers/profile";
import { board } from "src/store/reducers/board";
import { cards } from "src/store/reducers/cards";
import { columns } from "src/store/reducers/columns";
import { persistence } from "src/store/middlewares/persistence";
import { multiplayer } from "src/store/middlewares/multiplayer";
import { logger } from "src/store/middlewares/logger";

const reducer = combineReducers({
  profile,
  board,
  cards,
  columns,
});

export const store = createStore(
  reducer,
  ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?? compose)(
    applyMiddleware(persistence, multiplayer, logger)
  )
);

export type Store = typeof store;
export type State = ReturnType<Store["getState"]>;
export type Dispatch = Store["dispatch"];

export const useDispatch = () => _useDispatch<Dispatch>();
export const useSelector: TypedUseSelectorHook<State> = _useSelector;

export const useCard = (id: string) =>
  useSelector(({ cards }) => {
    return cards.find((card) => id === card.id);
  });
export const useColumn = (id: string) =>
  useSelector(({ columns }) => {
    return columns.find((column) => id === column.id);
  });

export const useProfile = () => useSelector(({ profile }) => profile);

export const useColumns = () => useSelector(({ columns }) => columns);

export const useCards = (columnId?: string) =>
  useSelector(({ cards }) =>
    columnId ? cards.filter((card) => columnId === card.columnId) : cards
  );
