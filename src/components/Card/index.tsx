import { type FormEvent, type KeyboardEvent, useState } from "react";
import { Button } from "~/components/Button";
import {
  createCard,
  createVote,
  deleteCard,
  deleteVote,
  updateCard,
  useCard,
  useParticipantVoteId,
  useVoteIdsByCardId,
} from "~/lib/data";
import { getParticipantId } from "~/lib/participantId";
import { useStoreContext } from "~/lib/store";

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

    if (event.key === "Escape") {
      event.preventDefault();
      onCancel?.();
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
        // biome-ignore lint/a11y/noAutofocus: ...
        autoFocus
        onKeyDown={handleKeyDown}
        required
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
  const context = useStoreContext();
  const [editing, setEditing] = useState(false);
  const { description } = useCard(cardId);
  const voteIds = useVoteIdsByCardId(cardId);
  const participantVoteId = useParticipantVoteId(cardId);

  const handleVote = () => {
    createVote(context, { participantId: getParticipantId(), cardId });
  };

  const handleUnvote = () => {
    if (!participantVoteId) {
      throw new Error("Can't unvote without a voteId");
    }
    deleteVote(context, participantVoteId);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleDelete = () => {
    deleteCard(context, cardId);
  };

  const handleSave = (data: { description: string }) => {
    updateCard(context, cardId, data);
    setEditing(false);
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-white rounded-md shadow group">
      {editing ? (
        <Form
          data={{ description }}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      ) : (
        <>
          <p className={`${presentation ? "text-xl p-3" : ""}`}>
            {description}
          </p>

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

              <menu className="flex items-center gap-3 transition-opacity opacity-0 group-focus-within:opacity-100 group-hover:opacity-100">
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
  defaults: { columnId: string };
};

function Blank({ defaults }: BlankProps) {
  const context = useStoreContext();
  const participantId = getParticipantId();

  const handleSave = (data: { description: string }) => {
    createCard(context, {
      participantId,
      columnId: defaults.columnId,
      description: data.description,
    });
  };

  return (
    <div className="p-3 bg-white rounded-md">
      <Form onSave={handleSave} />
    </div>
  );
}

Card.Blank = Blank;
