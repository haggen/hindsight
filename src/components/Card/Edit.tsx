import { FormEvent, KeyboardEvent } from "react";

import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";
import { TCard, useCards } from "~/src/lib/data";

type Props = {
  card: TCard;
  onFinish?: () => void;
};

export function Edit({ card, onFinish }: Props) {
  const cards = useCards();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputs = e.currentTarget.elements as unknown as {
      description: HTMLTextAreaElement;
    };

    cards.update({ id: card.id, description: inputs.description.value });

    e.currentTarget.reset();

    onFinish?.();
  };

  const handleDelete = () => {
    cards.destroy(card.id);
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

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <textarea
        name="description"
        placeholder="Type something…"
        onKeyDown={handleKeyDown}
        rows={3}
        autoFocus
        defaultValue={card?.description}
        required
      />
      <menu className={classes.menu}>
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
    </form>
  );
}
