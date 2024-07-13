import { type FormEvent, type KeyboardEvent, useState } from "react";
import { Button } from "~/components/Button";
import { createId } from "~/lib/createId";
import { getParticipantId } from "~/lib/participantId";
import { store } from "~/lib/store";
import { useCard } from "~/lib/useCard";
import { useParticipantVoteId } from "~/lib/useParticipantVoteId";
import { useVoteIdsByCardId } from "~/lib/useVoteIds";

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

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
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
        // biome-ignore lint/a11y/noAutofocus: <explanation>
        autoFocus
        onKeyDown={handleKeyDown}
        required
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
  presentation?: boolean;
};

export function Card({ cardId, presentation }: CardProps) {
  const [editing, setEditing] = useState(false);
  const { boardId, description } = useCard(cardId);
  const voteIds = useVoteIdsByCardId(cardId);
  const participantVoteId = useParticipantVoteId(cardId);

  const handleVote = () => {
    const voteId = createId();

    store.setRow("votes", voteId, {
      boardId,
      cardId,
      voterId: getParticipantId(),
    });
  };

  const handleUnvote = () => {
    if (!participantVoteId) {
      throw new Error("Can't unvote without a voteId");
    }
    store.delRow("votes", participantVoteId);
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
          <p className={`${presentation ? "text-2xl" : ""}`}>{description}</p>

          {presentation ? null : (
            <div className="flex items-center justify-between">
              <menu className="flex items-center gap-3">
                <li>
                  {participantVoteId ? (
                    <Button variant="active" onClick={handleUnvote}>
                      Unvote ({voteIds.length})
                    </Button>
                  ) : (
                    <Button onClick={handleVote}>
                      Vote ({voteIds.length})
                    </Button>
                  )}
                </li>
              </menu>

              <menu className="flex items-center gap-3 opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity">
                <li>
                  <Button onClick={handleEdit}>Edit</Button>
                </li>
              </menu>
            </div>
          )}
        </>
      )}
    </div>
  );
}

type BlankProps = {
  defaults: { columnId: string; boardId: string };
};

function Blank({ defaults }: BlankProps) {
  const participantId = getParticipantId();

  const handleSave = (data: { description: string }) => {
    const cardId = createId();

    store.setRow("cards", cardId, {
      authorId: participantId,
      boardId: defaults.boardId,
      columnId: defaults.columnId,
      createdAt: Date.now(),
      description: data.description,
    });

    const voteId = createId();

    store.setRow("votes", voteId, {
      cardId,
      boardId: defaults.boardId,
      voterId: participantId,
    });
  };

  return (
    <div className="bg-white rounded-md p-3">
      <Form onSave={handleSave} />
    </div>
  );
}

Card.Blank = Blank;
