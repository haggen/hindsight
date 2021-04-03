import copy from "copy-to-clipboard";

import { useBoard } from "src/lib/board";
import { confirm } from "src/lib/confirm";
import { Link } from "wouter";
import { useTooltip } from "src/components/tooltip";

import style from "./style.module.css";
import { useRef } from "react";
import { Button } from "../button";

const { location } = window;

const Brand = () => {
  const { open, close } = useTooltip();
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const onMouseEnter = () => {
    if (anchorRef.current) {
      open(anchorRef.current, "Go to a new board.");
    }
  };

  const onMouseLeave = () => {
    close();
  };

  return (
    <h1
      className={style.brand}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link href="/">
        <Button tag="a" ref={anchorRef}>
          Hindsight
        </Button>
      </Link>
    </h1>
  );
};

const Share = () => {
  const { open, close } = useTooltip();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onMouseEnter = () => {
    if (buttonRef.current) {
      open(buttonRef.current, "Copy this board's link.");
    }
  };

  const onMouseLeave = () => {
    close();
  };

  const onShare = () => {
    copy(location.href);
  };

  return (
    <Button
      tag="button"
      ref={buttonRef}
      onClick={onShare}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      Share
    </Button>
  );
};

export const Header = () => {
  const [, dispatch] = useBoard();

  const onClear = () => {
    if (confirm("Are you sure?")) {
      dispatch({ type: "reset" });
    }
  };

  return (
    <header className={style.header}>
      <Brand />

      <ul className={style.menu}>
        <li>
          <Share />
        </li>
        <li>
          <Button tag="button" onClick={onClear}>
            Clear
          </Button>
        </li>
        <li>
          <Button tag="button">Export</Button>
        </li>
      </ul>
    </header>
  );
};
