import { forwardRef } from "react";
import style from "./style.module.css";

type Props<T extends keyof JSX.IntrinsicElements> = {
  tag: T;
} & JSX.IntrinsicElements[T];

export const Button = forwardRef<HTMLElement, any>(
  ({ tag: Tag, ...props }, ref) => {
    return <Tag ref={ref} className={style.button} {...props} />;
  }
) as <T extends "a" | "button">(props: Props<T>) => JSX.Element;
