import * as style from "./style.module.css";

import { Column } from "~/src/components/Column";
import { useColumns } from "~/src/lib/data";

export function Board() {
  const [columns] = useColumns();

  return (
    <div className={style.board}>
      {columns.map((column) => (
        <Column key={column.id} column={column} />
      ))}
      <Column.New />
    </div>
  );
}
