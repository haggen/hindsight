import { useState, type FormEvent } from "react";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { createId } from "~/lib/createId";
import { store, UiReact } from "~/lib/store";

type FormProps = {
  data?: { description: string };
  onSave: (data: { description: string }) => void;
  onDelete?: () => void;
  onCancel?: () => void;
};

function Form({ data, onSave, onCancel, onDelete }: FormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = new FormData(event.currentTarget);
    const description = payload.get("description") as string;

    onSave({
      description,
    });

    event.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        name="description"
        placeholder="Type something..."
        aria-label="Column"
        autoComplete="off"
        className="font-bold text-lg"
        defaultValue={data?.description}
        autoFocus
      />

      {data ? (
        <footer className="flex items-center gap-3 justify-between">
          <Button variant="negative" onClick={onDelete}>
            Delete
          </Button>

          <div className="flex items-center gap-3">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="submit" variant="positive">
              Save
            </Button>
          </div>
        </footer>
      ) : (
        <footer className="flex items-center justify-end">
          <Button type="submit">Add column</Button>
        </footer>
      )}
    </form>
  );
}

type ColumnProps = {
  columnId: string;
};

export function Column({ columnId }: ColumnProps) {
  const [editing, setEditing] = useState(false);
  const { description } = UiReact.useRow("columns", columnId);
  const cardIds = UiReact.useSliceRowIds("cardsByColumnId", columnId);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleDelete = () => {
    store.delRow("columns", columnId);
  };

  const handleSave = (data: { description: string }) => {
    store.setCell("columns", columnId, "description", data.description);
    setEditing(false);
  };

  return (
    <section className="bg-slate-100 p-3 rounded-md flex flex-col gap-6">
      {editing ? (
        <Form
          data={{ description }}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      ) : (
        <header className="flex justify-between items-center group">
          <h2 className="font-bold text-lg">{description}</h2>

          <menu className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <li>
              <Button onClick={handleEdit}>Edit</Button>
            </li>
          </menu>
        </header>
      )}

      <ul className="flex flex-col gap-3">
        {cardIds.map((id) => (
          <li key={id}>
            <Card cardId={id} />
          </li>
        ))}
        <li>
          <Card.Blank defaults={{ columnId }} />
        </li>
      </ul>
    </section>
  );
}

type BlankProps = {
  defaults: { boardId: string };
};

function Blank({ defaults }: BlankProps) {
  const handleSave = (data: { description: string }) => {
    store.setRow("columns", createId(), {
      boardId: defaults.boardId,
      description: data.description,
    });
  };

  return (
    <div className="bg-slate-100 p-3 rounded-md flex flex-col gap-3">
      <Form onSave={handleSave} />
    </div>
  );
}

Column.Blank = Blank;
