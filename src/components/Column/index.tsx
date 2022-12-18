import { ReactNode, useState } from "react";

import { New } from "./New";
import { Edit } from "./Edit";
import * as classes from "./style.module.css";

import { TColumn } from "~/src/lib/data";
import { Button } from "~/src/components/Button";
import { ClassList } from "~/src/lib/classList";

type Props = {
  column: TColumn;
  children: ReactNode;
  header?: boolean;
  className?: string;
};

export function Column({ column, header = true, className, children }: Props) {
  const [isEditing, setEditing] = useState(false);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleFinishEditing = () => {
    setEditing(false);
  };

  const classList = new ClassList();
  classList.add(classes.column);
  if (className) {
    classList.add(className);
  }

  return (
    <section className={classList.toString()}>
      {header ? (
        isEditing ? (
          <Edit column={column} onFinish={handleFinishEditing} />
        ) : (
          <header className={classes.header}>
            <h1 className={classes.title}>{column.title}</h1>

            <menu>
              <li className={classes.contextual}>
                <Button onClick={handleEdit}>Edit</Button>
              </li>
            </menu>
          </header>
        )
      ) : null}

      {children}
    </section>
  );
}

Column.New = New;
