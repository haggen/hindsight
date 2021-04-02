import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import c from "classnames";
import { Placement } from "@popperjs/core";
import { usePopper } from "react-popper";

import style from "./style.module.css";

type Config = {
  active: boolean;
  element: unknown;
  text: string;
  placement: Placement;
  offset: number;
};

const initialConfig: Config = {
  active: false,
  element: null,
  text: "",
  placement: "auto",
  offset: 10,
};

type TooltipContext = {
  config: Config;
  open: <T extends HTMLElement>(
    element: T,
    text: string,
    opts?: Partial<Config>
  ) => void;
  close: () => void;
};

const Context = createContext<TooltipContext>({
  config: initialConfig,
  open: () => undefined,
  close: () => undefined,
});

type Props = {
  children: ReactNode;
};

export const Provider = ({ children }: Props) => {
  const [config, setConfig] = useState(initialConfig);
  const arrowRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { state, styles, attributes, update } = usePopper(
    config.element as HTMLElement,
    tooltipRef.current,
    {
      placement: config.placement,
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, config.offset],
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
  }, [config, update]);

  const open = <T extends HTMLElement>(
    element: T,
    text: string,
    opts?: Partial<Config>
  ) => {
    setConfig((config: any) => ({
      ...config,
      active: true,
      element,
      text,
      ...opts,
    }));
  };

  const close = () => {
    setConfig((config) => ({ ...config, active: false }));
  };

  return (
    <Context.Provider value={{ config, open, close }}>
      {children}

      {createPortal(
        <div
          key="tooltip"
          ref={tooltipRef}
          className={c(style.tooltip, state ? style[state.placement] : null, {
            [style.active]: config.active,
          })}
          style={styles.popper}
          {...attributes.popper}
        >
          {config.text}

          <div
            ref={arrowRef}
            className={c(style.arrow, state ? style[state.placement] : null, {
              [style.active]: config.active,
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
    </Context.Provider>
  );
};

export const useTooltip = () => {
  return useContext(Context);
};
