import { Column } from "~/components/Column";
import { useColumnIds } from "~/lib/useColumnIds";

export function Columns() {
  const columnIds = useColumnIds();

  return (
    <div className="grid grid-flow-col auto-cols-[20rem] gap-3 items-start">
      {columnIds.map((id) => (
        <Column key={id} columnId={id} />
      ))}
      <Column.Blank />
    </div>
  );
}
