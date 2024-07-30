import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useState,
} from "react";
import { Button } from "~/components/Button";
import { Card } from "~/components/Card";
import {
  createColumn,
  deleteColumn,
  updateColumn,
  useCardIdsByColumnId,
  useColumn,
} from "~/lib/data";
import { useStoreContext } from "~/lib/store";

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

    if (event.key === "Escape") {
      event.preventDefault();
      onCancel?.();
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
        className="text-lg font-black"
        defaultValue={data?.description}
        // biome-ignore lint/a11y/noAutofocus: ...
        autoFocus
        required
        onKeyDown={handleKeyDown}
      />

      {data ? (
        <footer className="flex items-center justify-between gap-3">
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
  const context = useStoreContext();
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
    deleteColumn(context, columnId);
  };

  const handleSave = (data: { description: string }) => {
    updateColumn(context, columnId, data);
    setEditing(false);
  };

  return (
    <section className="flex flex-col gap-6 p-3 rounded-md bg-stone-100">
      {editing ? (
        <Form
          data={{ description }}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      ) : (
        <header className="flex items-center justify-between group">
          <h2 className="text-lg font-black">{description}</h2>

          <menu className="flex items-center gap-3 transition-opacity opacity-0 group-focus-within:opacity-100 group-hover:opacity-100">
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
  const context = useStoreContext();

  const handleSave = (data: { description: string }) => {
    createColumn(context, {
      description: data.description,
    });
  };

  return (
    <div className="flex flex-col gap-3 p-3 rounded-md bg-stone-100">
      <Form onSave={handleSave} />
    </div>
  );
}

Column.Blank = Blank;
