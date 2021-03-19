import {
  useReducer,
  createContext,
  Dispatch,
  ReactNode,
  useContext,
} from "react";
import { nanoid } from "nanoid";
import update from "immutability-helper";

const reset = (
  _: BoardState,
  action: { type: "reset"; state?: BoardState }
) => {
  return action.state ?? initialState;
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

const toggleVote = (
  state: BoardState,
  action: {
    type: "toggleVote";
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
  | Parameters<typeof reset>[1]
  | Parameters<typeof push>[1]
  | Parameters<typeof remove>[1]
  | Parameters<typeof toggleVote>[1];

const reducer = (state: BoardState, action: Action) => {
  switch (action.type) {
    case "reset":
      return reset(state, action);
    case "push":
      return push(state, action);
    case "remove":
      return remove(state, action);
    case "toggleVote":
      return toggleVote(state, action);
    default:
      console.warn("Unknwon action", action);
      return state;
  }
};

type BoardState = {
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

const initialState: BoardState = {
  columns: [
    { id: nanoid(), title: "What went well?", color: "green" },
    { id: nanoid(), title: "What could be improved?", color: "yellow" },
    { id: nanoid(), title: "What should be done?", color: "blue" },
  ],
  cards: [],
};

type BoardContext = [BoardState, Dispatch<Action>];

const Context = createContext<BoardContext>([initialState, () => undefined]);

type Props = {
  children: ReactNode;
};

export const Provider = ({ children }: Props) => {
  const context = useReducer(reducer, initialState);

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export const useBoard = () => {
  return useContext(Context);
};
