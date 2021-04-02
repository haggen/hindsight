import {
  Children,
  cloneElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import c from "classnames";
import { Placement } from "@popperjs/core";
import { usePopper } from "react-popper";

import style from "./style.module.css";

const { setTimeout } = window;

type Props = {
  children: ReactElement;
  text: ReactNode;
  trigger?: "hover" | "click";
  timeout?: number;
  placement?: Placement;
  offset?: number;
};

export const Tooltip = ({
  trigger = "hover",
  text,
  children,
  timeout = 250,
  placement = "auto",
  offset = 10,
}: Props) => {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef(0);
  const arrowRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { state, styles, attributes, update } = usePopper(
    triggerRef.current,
    tooltipRef.current,
    {
      placement,
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, offset],
          },
        },
        {
          name: "arrow",
          options: {
            element: arrowRef.current,
          },
        },
      ],
    }
  );

  useEffect(() => {
    update?.();
  }, [active, update]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const onClick = () => {
    if (trigger === "click") {
      setActive(true);
    }
  };

  const onMouseEnter = () => {
    if (trigger === "hover") {
      setActive(true);
    }
    clearTimeout(timeoutRef.current);
  };

  const onMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActive(false);
    }, timeout);
  };

  const child = Children.only(children);

  return (
    <>
      {createPortal(
        <div
          key="tooltip"
          ref={tooltipRef}
          className={c(style.tooltip, state ? style[state.placement] : null, {
            [style.active]: active,
          })}
          style={styles.popper}
          {...attributes.popper}
        >
          {text}

          <div
            ref={arrowRef}
            className={c(style.arrow, state ? style[state.placement] : null, {
              [style.active]: active,
            })}
            style={styles.arrow}
            {...attributes.arrow}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M24 24H0l7.757-7.757a6 6 0 018.486 0L24 24z" />
            </svg>
          </div>
        </div>,
        document.body
      )}
      {cloneElement(child, {
        ref: triggerRef,
        onClick: (e: Event) => {
          onClick();
          child.props.onClick?.(e);
        },
        onMouseEnter: (e: Event) => {
          onMouseEnter();
          child.props.onMouseEnter?.(e);
        },
        onMouseLeave: (e: Event) => {
          onMouseLeave();
          child.props.onMouseLeave?.(e);
        },
      })}
    </>
  );
};
