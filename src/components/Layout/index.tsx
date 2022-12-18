import { ReactNode } from "react";

import * as classes from "./style.module.css";

import { Reaction } from "~/src/components/Reaction";
import { Display } from "~/src/components/Display";
import { Button } from "~/src/components/Button";
import { Flex } from "~/src/components/Flex";
import {
  SharedState,
  useAwareness,
  usePagination,
  useSharedMap,
} from "~/src/lib/data";
import { pluralize } from "~/src/lib/pluralize";

function useTimer() {
  const [{ target = 0 }, mutate] = useSharedMap<{
    target: number;
  }>(SharedState.Timer);

  const active = target > Date.now();

  const addFive = () =>
    mutate((map) => {
      map.set("target", Math.max(target, Date.now()) + 1000 * 60 * 5);
    });

  const clear = () =>
    mutate((map) => {
      map.set("target", Date.now());
    });

  return { active, target, addFive, clear } as const;
}

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  const { states: awareness } = useAwareness();
  const pagination = usePagination();
  const timer = useTimer();

  const count = Object.keys(awareness).length;

  const handlePresent = () => {
    pagination.next();
  };

  const handleBack = () => {
    pagination.clear();
  };

  return (
    <div className={classes.layout}>
      <Flex as="header" className={classes.topbar}>
        <Flex justify="space-between" style={{ flex: "1 0 0" }}>
          <h1>
            <a href="/">Hindsight</a>
          </h1>

          <Flex gap="3rem">
            <div
              title={pluralize(
                count,
                "There's only you.",
                `There are ${count} people connected.`
              )}
            >
              <Reaction reaction="👤" count={count} />
            </div>

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
                <Button onClick={() => timer.addFive()}>+5 min.</Button>
              </li>
            </Flex>
          </Flex>
        </Flex>

        <Display target={timer.target} active={timer.active} />

        <Flex justify="space-between" style={{ flex: "1 0 0" }}>
          <Flex as="menu" style={{ paddingInlineStart: "3.375rem" }}>
            <li>
              <Button disabled>Play</Button>
            </li>
            <li>
              <Button disabled>Queue ⏑</Button>
            </li>
            <li>
              <Button disabled>Vol. ---*---</Button>
            </li>
          </Flex>

          <Flex as="menu" justify="end" style={{ flex: "1 0 auto" }}>
            <li>
              {pagination.active ? (
                <Button onClick={handleBack} bordered>
                  Back to the board
                </Button>
              ) : (
                <Button
                  onClick={handlePresent}
                  bordered
                  disabled={!pagination.hasNext}
                >
                  Present →
                </Button>
              )}
            </li>
          </Flex>
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
