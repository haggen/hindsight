import { ReactNode } from "react";

import * as style from "./style.module.css";

import { Reaction } from "~/src/components/Reaction";
import { Timer } from "~/src/components/Timer";
import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <div className={style.layout}>
      <header className={style.topbar}>
        <h1>
          <a href="/">Hindsight</a>
        </h1>

        <Flex gap="1.5rem">
          <Reaction reaction="👤" count={1} />
          <Timer />
          <Flex>
            <Button disabled>Play</Button>
            <Button disabled>Queue ⏑</Button>
          </Flex>
        </Flex>

        <Button bordered disabled>
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
