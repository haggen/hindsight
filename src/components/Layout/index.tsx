import { ReactNode } from "react";

import * as classes from "./style.module.css";

import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import { useAwareness, usePresentation, useTimer } from "~/src/lib/data";
import { pluralize } from "~/src/lib/pluralize";
import { Display } from "~/src/components/Display";
import { Player } from "~/src/components/Player";

function People() {
  const { count } = useAwareness();

  const title = pluralize(
    count,
    "There's only you.",
    `There are ${count} people connected.`
  );

  return (
    <div title={title} aria-label={title}>
      👤
      <small>×{count}</small>
    </div>
  );
}

function Pagination() {
  const presentation = usePresentation();

  const handleNext = () => {
    presentation.next();
  };

  const handleBack = () => {
    presentation.prev();
  };

  if (!presentation.active) {
    return (
      <menu>
        <li>
          <Button onClick={handleNext} disabled={!presentation.hasNext}>
            Next →
          </Button>
        </li>
      </menu>
    );
  }

  return (
    <Flex as="menu">
      <li>
        <Button onClick={handleBack}>← Back</Button>
      </li>
      <li>
        <Button onClick={handleNext} disabled={presentation.finished}>
          Next →
        </Button>
      </li>
    </Flex>
  );
}

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  const timer = useTimer();

  return (
    <div className={classes.layout}>
      <Flex as="header" className={classes.topbar}>
        <Flex justify="space-between" style={{ flex: "1 0 0" }}>
          <h1>
            <a href="/" target="_blank">
              Hindsight
            </a>
          </h1>

          <Flex gap="3rem">
            <People />

            <Flex as="menu" style={{ paddingInlineEnd: ".375rem" }}>
              <li>
                <Button
                  onClick={() => timer.clear()}
                  disabled={!timer.active}
                  color="negative"
                >
                  Clear
                </Button>
              </li>
              <li>
                <Button onClick={() => timer.add(5 * 60)}>+5 min.</Button>
              </li>
            </Flex>
          </Flex>
        </Flex>

        <Display target={timer.target} active={timer.active} />

        <Flex justify="space-between" style={{ flex: "1 0 0" }}>
          <Player />

          <Pagination />
        </Flex>
      </Flex>

      <main className={classes.main}>{children}</main>

      <footer className={classes.footer}>
        <p>
          Made by <a href="https://twitter.com/haggen">me</a>. Source and
          feedback on{" "}
          <a
            href="https://github.com/haggen/hindsight"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
