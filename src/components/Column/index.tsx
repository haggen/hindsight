import { FormEvent, useState } from "react";

import { useMutation, useStorage } from "~/src/lib/liveblocks";
import { Card } from "~/src/components/Card";
import { createId, TCard, TColumn } from "~/src/lib/data";
import { Button } from "~/src/components/Button";

import * as style from "./style.module.css";

type FormProps = {
  column?: TColumn;
  onFinish?: () => void;
};

function Form({ column, onFinish }: FormProps) {
  const createColumn = useMutation(({ storage }, title: string) => {
    const id = createId();

    storage.get("columns").set(id, {
      id,
      title,
    });
  }, []);

  const patchColumn = useMutation(
    ({ storage }, title: string) => {
      if (column) {
        storage.get("columns").set(column.id, { ...column, title });
      }
    },
    [column]
  );

  const deleteColumn = useMutation(
    ({ storage }) => {
      if (column) {
        storage.get("columns").delete(column.id);
      }
    },
    [column]
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    if (column) {
      patchColumn(form.elements["title"].value);
    } else {
      createColumn(form.elements["title"].value);
    }

    form.reset();
    onFinish?.();
  };

  const handleDelete = () => {
    deleteColumn();
  };

  const handleCancel = () => {
    onFinish();
  };

  if (column) {
    return (
      <form className={style.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={style.title}
          name="title"
          placeholder="Type something…"
          defaultValue={column.title}
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
    );
  }

  return (
    <section className={style.column}>
      <form className={style.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={style.title}
          name="title"
          placeholder="Type something…"
        />
        <menu className={style.menu}>
          <li>
            <Button type="submit">Create new column</Button>
          </li>
        </menu>
      </form>
    </section>
  );
}

export function Column({ column }) {
  const [isEditing, setEditing] = useState(false);

  const cards = useStorage((root) => {
    return Array.from(root.cards.values())
      .filter((card) => card.columnId === column.id)
      .sort((a, b) => a.createdAt - b.createdAt);
  });

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
