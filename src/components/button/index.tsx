import { forwardRef } from "react";
import style from "./style.module.css";

type Props<T extends keyof JSX.IntrinsicElements> = {
  tag: T;
} & JSX.IntrinsicElements[T];

type Tags = "a" | "button";

export const Button = forwardRef(
  <T extends Tags>({ tag: Tag, ...props }: Props<T>, ref: unknown) => {
    return <Tag ref={ref} className={style.button} {...(props as any)} />;
  }
);
