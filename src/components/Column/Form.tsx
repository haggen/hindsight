import { FormEvent } from "react";

import { TColumn, useColumns } from "~/src/lib/data";
import { Button } from "~/src/components/Button";

import * as style from "./style.module.css";

type Props = {
  column?: TColumn;
  onFinish?: () => void;
};

export function Form({ column, onFinish }: Props) {
  const [, { patch, create, remove }] = useColumns();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputs = e.currentTarget.elements as unknown as {
      title: HTMLInputElement;
    };

    if (column !== undefined) {
      patch({ ...column, title: inputs.title.value });
    } else {
      create({ title: inputs.title.value });
    }

    e.currentTarget.reset();

    onFinish?.();
  };

  const handleDelete = () => {
    if (!column) {
      throw new Error("Cannot delete a column that doesn't exist");
    }
    remove(column);
  };

  const handleCancel = () => {
    onFinish?.();
  };

  const menu = column ? (
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
        <Button type="submit">Create new column</Button>
      </li>
    </menu>
  );

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <input
        type="text"
        className={style.title}
        name="title"
        placeholder="Type something…"
        defaultValue={column?.title}
      />
      {menu}
    </form>
  );
}
