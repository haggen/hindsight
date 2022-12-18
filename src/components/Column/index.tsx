import { useState } from "react";

import { New } from "./New";
import { Edit } from "./Edit";
import * as classes from "./style.module.css";

import { Flex } from "~/src/components/Flex";
import { TColumn, useCards, usePagination } from "~/src/lib/data";
import { Card } from "~/src/components/Card";
import { Button } from "~/src/components/Button";
import { ClassList } from "~/src/lib/classList";

type Props = {
  column: TColumn;
};

export function Column({ column }: Props) {
  const [isEditing, setEditing] = useState(false);
  const cards = useCards({ columnId: column.id });
  const pagination = usePagination();

  const handleEdit = () => {
    setEditing(true);
  };

  const handleFinish = () => {
    setEditing(false);
  };

  const handlePrevious = () => {
    pagination.prev();
  };

  const handleNext = () => {
    pagination.next();
  };

  const classList = new ClassList();
  classList.add(classes.column);
  if (pagination.active) {
    classList.add(classes.single);
  }

  return (
    <section className={classList.toString()}>
      {isEditing ? (
        <Edit column={column} onFinish={handleFinish} />
      ) : (
        <header className={classes.header}>
          <h1 className={classes.title}>{column.title}</h1>

          {pagination.active ? null : (
            <menu>
              <li className={classes.contextual}>
                <Button onClick={handleEdit}>Edit</Button>
              </li>
            </menu>
          )}
        </header>
      )}

      <ul className={classes.cards}>
        {pagination.active ? (
          <Card card={pagination.card} />
        ) : (
          <>
            {cards.list.map((card) => (
              <li key={card.id}>
                <Card card={card} />
              </li>
            ))}
            <li>
              <Card.New defaults={{ columnId: column.id }} />
            </li>
          </>
        )}
      </ul>

      {pagination.active ? (
        <Flex as="ul" justify="space-between">
          <li>
            <Button onClick={handlePrevious} disabled={!pagination.hasPrev}>
              ← Previous
            </Button>
          </li>
          <li>
            {pagination.index + 1} of {pagination.length}
          </li>
          <li>
            <Button onClick={handleNext} disabled={!pagination.hasNext}>
              Next →
            </Button>
          </li>
        </Flex>
      ) : null}
    </section>
  );
}

Column.New = New;
