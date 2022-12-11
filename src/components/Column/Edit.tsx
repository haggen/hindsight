import { FormEvent } from "react";

import * as style from "./style.module.css";

import { TColumn, useColumns } from "~/src/lib/data";
import { Button } from "~/src/components/Button";

type Props = {
  column: TColumn;
  onFinish?: () => void;
};

export function Edit({ column, onFinish }: Props) {
  const [, { update, destroy }] = useColumns();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputs = e.currentTarget.elements as unknown as {
      title: HTMLInputElement;
    };

    update({ ...column, title: inputs.title.value });

    e.currentTarget.reset();

    onFinish?.();
  };

  const handleDelete = () => {
    destroy(column.id);
  };

  const handleCancel = () => {
    onFinish?.();
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        defaultValue={column.title}
        placeholder="Type something…"
        className={style.title}
        autoFocus
      />

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
    </form>
  );
}
