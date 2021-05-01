import { useEffect } from "react";

import { Column } from "src/components/column";
import { getInitialState, useBoard } from "src/components/board/state";

import style from "./style.module.css";

type Props = {
  id: string;
};

const save = <T extends { id: string }>(state: T) => {
  localStorage.setItem(`board-${state.id}`, JSON.stringify(state));
};

const load = (id: string) => {
  const item = localStorage.getItem(`board-${id}`);
  return item ? JSON.parse(item) : null;
};

export const Board = ({ id }: Props) => {
  const [state, dispatch] = useBoard();

  useEffect(() => {
    const state = load(id);

    if (state) {
      dispatch({ type: "load", state });
    } else {
      dispatch({ type: "load", state: getInitialState(id) });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (state.id) {
      save(state);
    }
  }, [state]);

  return (
    <div className={style.board}>
      {state.columns.map(({ id }) => (
        <Column key={id} id={id} />
      ))}
    </div>
  );
};
