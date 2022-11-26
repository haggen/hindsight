import { createId } from "~/src/lib/data";
import { useMutation, useStorage } from "~/src/lib/liveblocks";
import { Column } from "~/src/components/Column";

import * as style from "./style.module.css";

export function Board() {
  const columns = useStorage(({ columns }) => Array.from(columns.values()));

  return (
    <div className={style.board}>
      {columns.map((column) => (
        <Column key={column.id} column={column} />
      ))}
      <Column.Form />
    </div>
  );
}
