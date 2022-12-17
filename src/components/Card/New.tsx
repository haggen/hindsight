import { FormEvent, KeyboardEvent } from "react";

import * as style from "./style.module.css";

import { Button } from "~/src/components/Button";
import { TCard, useCards } from "~/src/lib/data";

type Props = {
  defaults: Omit<Semipartial<TCard, "columnId">, "id">;
  onFinish?: () => void;
};

export function New({ defaults, onFinish }: Props) {
  const cards = useCards();
  const authorId = "123";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputs = e.currentTarget.elements as unknown as {
      description: HTMLTextAreaElement;
    };

    cards.create({
      columnId: defaults.columnId,
      authorId,
      description: inputs.description.value,
    });

    e.currentTarget.reset();

    onFinish?.();
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
    <div className={style.placeholder}>
      <form className={style.form} onSubmit={handleSubmit}>
        <textarea
          name="description"
          placeholder="Type something…"
          rows={3}
          onKeyDown={handleKeyDown}
          defaultValue={defaults.description}
          autoFocus
          required
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
