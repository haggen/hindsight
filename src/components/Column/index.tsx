import { useState } from "react";

import { TColumn, useCards } from "~/src/lib/data";
import { Card } from "~/src/components/Card";
import { Button } from "~/src/components/Button";

import { New } from "./New";
import { Edit } from "./Edit";

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

  const handleFinish = () => {
    setEditing(false);
  };

  return (
    <section className={style.column}>
      {isEditing ? (
        <Edit column={column} onFinish={handleFinish} />
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
          <Card.New defaults={{ columnId: column.id }} />
        </li>
      </ul>
    </section>
  );
}

Column.New = New;
