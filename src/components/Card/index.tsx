import { FormEvent, useState } from "react";

import { useMutation, useMyPresence, useSelf } from "~/src/lib/liveblocks";
import { Button } from "~/src/components/Button";
import { Emoji } from "~/src/components/Emoji";
import { TCard, createId } from "~/src/lib/data";

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
        storage
          .get("cards")
          .set(card.id, { ...card, description: description });
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
    if ("id" in card) {
      patchCard(e.currentTarget.elements["description"].value);
    } else {
      createCard(e.currentTarget.elements["description"].value);
    }
    e.currentTarget.reset();
    onFinish?.();
  };

  const handleDelete = () => {
    deleteCard();
  };

  const handleCancel = () => {
    onFinish();
  };

  if ("id" in card) {
    return (
      <div className={style.card}>
        <form className={style.form} onSubmit={handleSubmit}>
          <textarea
            className={style.description}
            name="description"
            placeholder="Type something…"
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
          className={style.description}
          name="description"
          placeholder="Type something…"
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

  const addReaction = useMutation(
    ({ storage }, reaction: string) => {
      const { reactions, reactionCount } = card;
      reactions[reaction] = (reactions[reaction] ?? 0) + 1;

      storage
        .get("cards")
        .set(card.id, { ...card, reactions, reactionCount: reactionCount + 1 });
    },
    [card]
  );

  const handleEdit = () => {
    setEditing(true);
  };

  if (isEditing) {
    return <Form card={card} onFinish={() => setEditing(false)} />;
  }

  return (
    <article className={style.card}>
      <p className={style.description}>{card.description}</p>

      <menu className={style.menu}>
        <li>
          <ul className={style.reactions}>
            {availableReactions.map((reaction) => (
              <li key={reaction}>
                <button
                  className={style.reaction}
                  onClick={() => addReaction(reaction)}
                >
                  <Emoji emoji={reaction} />
                  <small>×{card.reactions[reaction] ?? 0}</small>
                </button>
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

Card.Form = Form;
