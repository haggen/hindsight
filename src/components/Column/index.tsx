import { useState } from "react";

import { Card } from "~/src/components/Card";
import { TColumn, useCards } from "~/src/lib/data";
import { Button } from "~/src/components/Button";
import { Form } from "./Form";

import * as style from "./style.module.css";

type Props = {
  column: TColumn;
};

export function Column({ column }: Props) {
  const [isEditing, setEditing] = useState(false);
  const [cards] = useCards({ columnId: column.id });

  const handleEdit = () => {
    setEditing(true);
  };

  return (
    <section className={style.column}>
      {isEditing ? (
        <Form column={column} onFinish={() => setEditing(false)} />
      ) : (
        <header className={style.header}>
          <h1 className={style.title}>{column.title}</h1>

          <menu>
            <li className={style.contextual}>
              <Button onClick={handleEdit}>Edit</Button>
            </li>
          </menu>
        </header>
      )}

      <ul className={style.cards}>
        {cards.map((card) => (
          <li key={card.id}>
            <Card card={card} />
          </li>
        ))}
        <li>
          <Card.Form card={{ columnId: column.id }} />
        </li>
      </ul>
    </section>
  );
}

Column.Form = Form;
