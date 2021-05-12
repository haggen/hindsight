import { nanoid } from "nanoid";
import { FormEvent, KeyboardEvent } from "react";

import { Card } from "src/components/card";
import { Splash } from "src/components/splash";
import { useCards, useColumn, useDispatch } from "src/store";

import style from "./style.module.css";

type ColumnProps = {
  id: string;
};

export const Column = ({ id }: ColumnProps) => {
  const column = useColumn(id);
  const cards = useCards(id);
  const dispatch = useDispatch();

  if (!column) {
    throw new Error(`Column '${id}' not found`);
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
      type: "cards/create",
      payload: {
        id: nanoid(),
        columnId: id,
        text: String(e.currentTarget.content.value),
        color: column.color,
        voterIds: [],
      },
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
              <Card id={id} />
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
