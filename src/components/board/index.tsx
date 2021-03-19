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
    console.log("load data", key);
    const item = localStorage.getItem(key);
    dispatch({ type: "reset", state: item ? JSON.parse(item) : undefined });
  }, [key, dispatch]);

  useEffect(() => {
    console.log("save data", key);
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
