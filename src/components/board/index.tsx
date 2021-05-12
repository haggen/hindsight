import { useEffect } from "react";

import { Column } from "src/components/column";
import { useDispatch, useColumns } from "src/store";

import style from "./style.module.css";

type Props = {
  id: string;
};

export const Board = ({ id }: Props) => {
  const columns = useColumns();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: "board/load", payload: { id } });
  }, [dispatch, id]);

  useEffect(() => {
    dispatch({ type: "ostrich/connect", payload: { boardId: id } });
  }, [dispatch, id]);

  return (
    <div className={style.board}>
      {columns.map(({ id }) => (
        <Column key={id} id={id} />
      ))}
    </div>
  );
};
