import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useState,
} from "react";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import { createColumn } from "~/lib/createColumn";
import { deleteColumn } from "~/lib/deleteColumn";
import { updateColumn } from "~/lib/updateColumn";
import { useCardIdsByColumnId } from "~/lib/useCardIds";
import { useColumn } from "~/lib/useColumn";

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

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
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
        // biome-ignore lint/a11y/noAutofocus: <explanation>
        autoFocus
        required
        onKeyDown={handleKeyDown}
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
  children?: ReactNode;
};

export function Column({ columnId, children }: ColumnProps) {
  const [editing, setEditing] = useState(false);
  const { description } = useColumn(columnId);
  const cardIds = useCardIdsByColumnId(columnId);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleDelete = () => {
    deleteColumn(columnId);
  };

  const handleSave = (data: { description: string }) => {
    updateColumn(columnId, data);
    setEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      setEditing(false);
    }
  };

  return (
    <section
      className="bg-stone-100 p-3 rounded-md flex flex-col gap-6"
      onKeyDown={handleKeyDown}
    >
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

          <menu className="flex items-center gap-3 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
            <li>
              <Button onClick={handleEdit}>Edit</Button>
            </li>
          </menu>
        </header>
      )}

      {children ?? (
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
      )}
    </section>
  );
}

function Blank() {
  const handleSave = (data: { description: string }) => {
    createColumn({
      description: data.description,
    });
  };

  return (
    <div className="bg-stone-100 p-3 rounded-md flex flex-col gap-3">
      <Form onSave={handleSave} />
    </div>
  );
}

Column.Blank = Blank;
