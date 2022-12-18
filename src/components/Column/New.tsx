import { FormEvent } from "react";

import * as classes from "./style.module.css";

import { TColumn, useColumns } from "~/src/lib/data";
import { Button } from "~/src/components/Button";

type Props = {
  defaults?: Partial<Pick<TColumn, "title">>;
};

export function New({ defaults }: Props) {
  const [, { create }] = useColumns();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inputs = e.currentTarget.elements as unknown as {
      title: HTMLInputElement;
    };

    create({ title: inputs.title.value });

    e.currentTarget.reset();
  };

  return (
    <section className={classes.column}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={classes.title}
          name="title"
          placeholder="Type something…"
          defaultValue={defaults?.title}
          autoFocus
          required
        />
        <menu className={classes.menu}>
          <li>
            <Button type="submit">Create new column</Button>
          </li>
        </menu>
      </form>
    </section>
  );
}
