import { useEffect } from "react";

import { Column } from "src/components/column";
import { useBoard } from "src/lib/board";

import style from "./style.module.css";

type Props = {
  id: string;
};

export const Board = ({ id }: Props) => {
  const {
    setId,
    state: { columns },
  } = useBoard();

  useEffect(() => {
    setId(id);
  }, [id, setId]);

  return (
    <div className={style.board}>
      {columns.map(({ id }) => (
        <Column key={id} id={id} />
      ))}
    </div>
  );
};
