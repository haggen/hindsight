import { ReactNode } from "react";

import * as style from "./style.module.css";

import { Reaction } from "~/src/components/Reaction";
import { Timer } from "~/src/components/Timer";
import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { useAwareness, usePagination } from "~/src/lib/data";
import { pluralize } from "~/src/lib/pluralize";

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  const { states: awareness } = useAwareness();
  const pagination = usePagination();

  const count = Object.keys(awareness).length;

  const handleDiscuss = () => {
    pagination.next();
  };

  return (
    <div className={style.layout}>
      <header className={style.topbar}>
        <h1>
          <a href="/">Hindsight</a>
        </h1>

        <Flex gap="1.5rem">
          <div
            title={pluralize(
              count,
              "There's only you.",
              `There are ${count} people connected.`
            )}
          >
            <Reaction reaction="👤" count={count} />
          </div>

          <Timer />

          <Flex style={{ paddingInlineEnd: "4.5rem" }}>
            <Button disabled>Play</Button>
            <Button disabled>Queue ⏑</Button>
          </Flex>
        </Flex>

        <Button onClick={handleDiscuss} bordered disabled={!pagination.hasNext}>
          Discuss →
        </Button>
      </header>

      <main>{children}</main>

      <footer className={style.footer}>
        <p>©️ 2022 Hindsight</p>
      </footer>
    </div>
  );
}
