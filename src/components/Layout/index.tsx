import { ReactNode } from "react";

import * as style from "./style.module.css";

import { Timer } from "~/src/components/Timer";
import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { useCards } from "~/src/lib/data";

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  const [cards] = useCards();

  return (
    <div className={style.layout}>
      <header className={style.topbar}>
        <h1>
          <a href="/">Hindsight</a>
        </h1>

        <Flex gap="1.5rem">
          <Timer />
          <Flex>
            <Button disabled>Play</Button>
            <Button disabled>Queue ⏑</Button>
          </Flex>
        </Flex>

        <Button disabled={cards.length === 0}>Discuss →</Button>
      </header>

      <main>{children}</main>

      <footer className={style.footer}>
        <p>©️ 2022 Hindsight</p>
      </footer>
    </div>
  );
}
