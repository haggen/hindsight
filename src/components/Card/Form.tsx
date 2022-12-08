import { FormEvent, KeyboardEvent } from "react";

import { useMyPresence } from "~/src/lib/liveblocks";
import { Button } from "~/src/components/Button";
import { TCard, useCards } from "~/src/lib/data";

import * as style from "./style.module.css";

type Props = {
  columnId: string;
  card?: TCard;
  onFinish?: () => void;
};

export function Form({ card, columnId, onFinish }: Props) {
  const [, { patch, create, remove }] = useCards({ columnId });
  const [{ id: authorId }] = useMyPresence();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputs = e.currentTarget.elements as unknown as {
      description: HTMLTextAreaElement;
    };

    if (card) {
      patch({ id: card.id, description: inputs.description.value });
    } else {
      create({ columnId, authorId, description: inputs.description.value });
    }

    e.currentTarget.reset();

    onFinish?.();
  };

  const handleDelete = () => {
    if (card) {
      remove(card.id);
    }
  };

  const handleCancel = () => {
    onFinish?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    switch (e.key) {
      case "Escape": {
        handleCancel();
        break;
      }
      case "Enter": {
        e.currentTarget.form?.requestSubmit();
        break;
      }
      default:
        return;
    }

    e.preventDefault();
  };

  const menu = card ? (
    <menu className={style.menu}>
      <li>
        <Button onClick={handleDelete} color="negative">
          Delete
        </Button>
      </li>
      <li>
        <ul>
          <li>
            <Button type="submit" color="positive">
              Save
            </Button>
          </li>
          <li>
            <Button onClick={handleCancel}>Cancel</Button>
          </li>
        </ul>
      </li>
    </menu>
  ) : (
    <menu className={style.menu}>
      <li>
        <Button type="submit">Create new card</Button>
      </li>
    </menu>
  );

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <textarea
        name="description"
        placeholder="Type something…"
        onKeyDown={handleKeyDown}
        rows={3}
        autoFocus
        defaultValue={card?.description}
      />
      {menu}
    </form>
  );
}
