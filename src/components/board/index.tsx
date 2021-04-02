import { useEffect } from "react";

import { Column } from "src/components/column";
import { useBoard } from "src/lib/board";
import {
  getLocalStorageInitializer,
  useLocalStorageEffect,
} from "src/lib/local-storage";

import style from "./style.module.css";

type Props = {
  id: string;
};

export const Board = ({ id }: Props) => {
  const [state, dispatch] = useBoard();
  const key = `board-${id}`;

  useEffect(() => {
    const initialize = getLocalStorageInitializer(key);
    dispatch({ type: "reset", state: initialize(undefined) });
  }, [key, dispatch]);

  useLocalStorageEffect(key, state);

  return (
    <div className={style.board}>
      {state.columns.map(({ id }) => (
        <Column key={id} id={id} />
      ))}
    </div>
  );
};
