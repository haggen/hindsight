import * as style from "./style.module.css";

import { Column } from "~/src/components/Column";
import { useColumns, usePagination } from "~/src/lib/data";

export function Board() {
  const [columns] = useColumns();
  const pagination = usePagination();

  return (
    <div className={style.board}>
      {pagination.active ? (
        <Column column={pagination.column} />
      ) : (
        <>
          {columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
          <Column.New />
        </>
      )}
    </div>
  );
}
