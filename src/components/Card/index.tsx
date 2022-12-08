import { FormEvent, useState } from "react";

import { useMutation, useMyPresence } from "~/src/lib/liveblocks";
import { Button } from "~/src/components/Button";
import { TCard, createId, useCards } from "~/src/lib/data";
import { Reaction } from "~/src/components/Reaction";

import * as style from "./style.module.css";

const availableReactions = ["👍", "🎉", "😍", "🤔"];

type FormProps = {
  card: TCard | Omit<Semipartial<TCard, "columnId">, "id">;
  onFinish?: () => void;
};

function Form({ card, onFinish }: FormProps) {
  const createCard = useMutation(
    ({ storage, self }, description: string) => {
      const id = createId();

      storage.get("cards").set(id, {
        id,
        createdAt: Date.now(),
        columnId: card.columnId,
        authorId: self.presence.id,
        description,
        reactions: { "👍": 1 },
        reactionCount: 1,
      });
    },
    [card.columnId]
  );

  const patchCard = useMutation(
    ({ storage }, description: string) => {
      if ("id" in card) {
        storage.get("cards").set(card.id, { ...card, description });
      }
    },
    [card]
  );

  const deleteCard = useMutation(
    ({ storage }) => {
      if ("id" in card) {
        storage.get("cards").delete(card.id);
      }
    },
    [card]
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputs = e.currentTarget.elements as unknown as {
      description: HTMLTextAreaElement;
    };

    if ("id" in card) {
      patchCard(inputs.description.value);
    } else {
      createCard(inputs.description.value);
    }

    e.currentTarget.reset();

    onFinish?.();
  };

  const handleDelete = () => {
    deleteCard();
  };

  const handleCancel = () => {
    onFinish?.();
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "Escape": {
        handleCancel();
        break;
      }
      case "Enter": {
        e.target.form.requestSubmit();
        break;
      }
      default:
        return;
    }

    e.preventDefault();
  };

  if ("id" in card) {
    return (
      <div className={style.card}>
        <form className={style.form} onSubmit={handleSubmit}>
          <textarea
            name="description"
            placeholder="Type something…"
            onKeyDown={handleKeyDown}
            defaultValue={card.description}
            rows={3}
          />
          <menu className={style.menu}>
            <li>
              <Button onClick={handleDelete}>Delete</Button>
            </li>
            <li>
              <ul>
                <li>
                  <Button type="submit">Save</Button>
                </li>
                <li>
                  <Button onClick={handleCancel}>Cancel</Button>
                </li>
              </ul>
            </li>
          </menu>
        </form>
      </div>
    );
  }

  return (
    <div className={style.placeholder}>
      <form className={style.form} onSubmit={handleSubmit}>
        <textarea
          name="description"
          placeholder="Type something…"
          onKeyDown={handleKeyDown}
          rows={3}
        />
        <menu className={style.menu}>
          <li>
            <Button type="submit">Create new card</Button>
          </li>
        </menu>
      </form>
    </div>
  );
}

type CardProps = {
  card: TCard;
};

export function Card({ card }: CardProps) {
  const [isEditing, setEditing] = useState(false);
  const [presence] = useMyPresence();
  const [, { react }] = useCards();

  const handleEdit = () => {
    setEditing(true);
  };

  const handleReaction = (reaction: string) => {
    react({ id: card.id, reaction });
  };

  if (isEditing) {
    return <Form card={card} onFinish={() => setEditing(false)} />;
  }

  return (
    <article className={style.card}>
      <p>{card.description}</p>

      <menu className={style.menu}>
        <li>
          <ul className={style.reactions}>
            {availableReactions.map((reaction) => (
              <li key={reaction}>
                <Reaction
                  reaction={reaction}
                  count={card.reactions[reaction]}
                  onClick={handleReaction}
                />
              </li>
            ))}
          </ul>
        </li>

        <li className={style.contextual}>
          {card.authorId === presence.id ? (
            <Button onClick={handleEdit}>Edit</Button>
          ) : null}
        </li>
      </menu>
    </article>
  );
}
