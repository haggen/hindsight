import { FormEvent, KeyboardEvent } from "react";

import { Card } from "src/components/card";
import { Splash } from "src/components/splash";
import { useBoard } from "src/lib/board";

import style from "./style.module.css";

type ColumnProps = {
  id: string;
};

export const Column = ({ id }: ColumnProps) => {
  const { state, dispatch } = useBoard();

  const { cards, column } = {
    column: state.columns.find((column) => column.id === id),
    cards: state.cards.filter((card) => card.columnId === id),
  };

  if (!column) {
    return null;
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({
      type: "push",
      columnId: id,
      content: e.currentTarget.content.value,
    });
    e.currentTarget.reset();
  };

  return (
    <div className={style.column}>
      <form className={style.form} onSubmit={onSubmit}>
        <textarea
          name="content"
          placeholder={column.title}
          onKeyDown={onKeyDown}
          required
        />
      </form>
      {cards.length ? (
        <ul className={style.list}>
          {cards.map(({ id }) => (
            <li key={id} className={style.item}>
              <Card color={column.color} id={id} />
            </li>
          ))}
        </ul>
      ) : (
        <Splash
          title="Empty"
          description="Type a new item above and press Enter."
        />
      )}
    </div>
  );
};
