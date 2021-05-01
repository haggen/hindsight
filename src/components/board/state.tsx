import {
  useReducer,
  createContext,
  Dispatch,
  ReactNode,
  useContext,
} from "react";
import { nanoid } from "nanoid";
import update from "immutability-helper";

const load = (
  _: BoardState,
  action: { type: "load"; id: string } | { type: "load"; state: BoardState }
) => {
  if ("id" in action) {
    return getInitialState(action.id);
  }
  return action.state;
};

const clear = (state: BoardState, action: { type: "clear" }) => {
  return update(state, {
    cards: {
      $set: [],
    },
  });
};

const push = (
  state: BoardState,
  action: { type: "push"; columnId: string; content: string }
) => {
  const { content, columnId } = action;

  return update(state, {
    cards: {
      $push: [
        {
          id: nanoid(),
          columnId,
          content,
          voters: [],
        },
      ],
    },
  });
};

const remove = (
  state: BoardState,
  action: { type: "remove"; cardId: string }
) => {
  return update(state, {
    cards: (cards) => cards.filter(({ id }) => id !== action.cardId),
  });
};

const vote = (
  state: BoardState,
  action: {
    type: "vote";
    cardId: string;
    author: string;
  }
) => {
  const i = state.cards.findIndex(({ id }) => id === action.cardId);

  if (i < 0) {
    return state;
  }

  return update(state, {
    cards: {
      [i]: {
        voters: (voters) => {
          if (voters.includes(action.author)) {
            return voters.filter((userId) => userId !== action.author);
          }
          return voters.concat(action.author);
        },
      },
    },
  });
};

type Action =
  | Parameters<typeof load>[1]
  | Parameters<typeof clear>[1]
  | Parameters<typeof push>[1]
  | Parameters<typeof remove>[1]
  | Parameters<typeof vote>[1];

const reducer = (state: BoardState, action: Action) => {
  console.log(action);

  switch (action.type) {
    case "load":
      return load(state, action);
    case "clear":
      return clear(state, action);
    case "push":
      return push(state, action);
    case "remove":
      return remove(state, action);
    case "vote":
      return vote(state, action);
    default:
      console.warn("Unknwon action", action);
      return state;
  }
};

type BoardState = {
  id: string;
  cards: {
    id: string;
    columnId: string;
    content: string;
    voters: string[];
  }[];
  columns: {
    id: string;
    title: string;
    color: string;
  }[];
};

export const getInitialState = (id: string = ""): BoardState => {
  return {
    id,
    columns: [
      { id: nanoid(), title: "What went well?", color: "green" },
      { id: nanoid(), title: "What could be improved?", color: "yellow" },
      { id: nanoid(), title: "What should be done?", color: "blue" },
    ],
    cards: [],
  };
};

type BoardContext = [BoardState, Dispatch<Action>];

const Context = createContext<BoardContext>([
  getInitialState(),
  () => undefined,
]);

type Props = {
  children: ReactNode;
};

export const Provider = ({ children }: Props) => {
  const value = useReducer(reducer, getInitialState());

  console.debug("BoardProvider rendered");

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useBoard = () => {
  return useContext(Context);
};
