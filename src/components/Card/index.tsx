import { useState, type FormEvent } from "react";
import { Button } from "~/components/Button";
import { createId } from "~/lib/createId";
import { store, UiReact } from "~/lib/store";
import { getUserId } from "~/lib/userId";

type FormProps = {
  data?: { description: string };
  onSave: (data: { description: string }) => void;
  onDelete?: () => void;
  onCancel?: () => void;
};

function Form({ data, onSave, onDelete, onCancel }: FormProps) {
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
      <textarea
        rows={3}
        name="description"
        placeholder="Type something..."
        aria-label="Card"
        autoComplete="off"
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
          <Button type="submit">Add card</Button>
        </footer>
      )}
    </form>
  );
}

type CardProps = {
  cardId: string;
};

export function Card({ cardId }: CardProps) {
  const [editing, setEditing] = useState(false);
  const { description } = UiReact.useRow("cards", cardId);
  const voteIds = UiReact.useSliceRowIds("votesByCardId", cardId);
  const myVoteId = voteIds.find((voteId) => {
    const voterId = store.getCell("votes", voteId, "voterId");
    return voterId === getUserId();
  });

  const handleVote = () => {
    const voteId = createId();

    store.setRow("votes", voteId, {
      cardId,
      voterId: getUserId(),
    });
  };

  const handleUnvote = () => {
    store.delRow("votes", myVoteId);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleDelete = () => {
    store.delRow("cards", cardId);
  };

  const handleSave = (data: { description: string }) => {
    store.setCell("cards", cardId, "description", data.description);
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-md shadow p-3 flex flex-col gap-3 group">
      {editing ? (
        <Form
          data={{ description }}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      ) : (
        <>
          <p>{description}</p>

          <div className="flex items-center justify-between">
            <menu className="flex items-center gap-3">
              <li>
                {myVoteId ? (
                  <Button variant="active" onClick={handleUnvote}>
                    Unvote ({voteIds.length})
                  </Button>
                ) : (
                  <Button onClick={handleVote}>Vote ({voteIds.length})</Button>
                )}
              </li>
            </menu>

            <menu className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <li>
                <Button onClick={handleEdit}>Edit</Button>
              </li>
            </menu>
          </div>
        </>
      )}
    </div>
  );
}

type BlankProps = {
  defaults: { columnId: string };
};

function Blank({ defaults }: BlankProps) {
  const handleSave = (data: { description: string }) => {
    const cardId = createId();

    store.setRow("cards", cardId, {
      columnId: defaults.columnId,
      description: data.description,
    });

    store.setRow("votes", createId(), {
      cardId,
      voterId: getUserId(),
    });
  };

  return (
    <div className="bg-white rounded-md p-3">
      <Form onSave={handleSave} />
    </div>
  );
}

Card.Blank = Blank;
