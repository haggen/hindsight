import { useEffect } from "react";

import { Column } from "src/components/column";
import { useBoard } from "src/lib/board";

import style from "./style.module.css";

type Props = {
  id: string;
};

export const Board = ({ id }: Props) => {
  const [state, dispatch] = useBoard();
  const { columns } = state;
  const key = `board-${id}`;

  useEffect(() => {
    const item = localStorage.getItem(key);
    dispatch({ type: "reset", state: item ? JSON.parse(item) : undefined });
  }, [key, dispatch]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return (
    <div className={style.board}>
      {columns.map(({ id }) => (
        <Column key={id} id={id} />
      ))}
    </div>
  );
};
