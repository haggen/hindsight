import { forwardRef } from "react";
import style from "./style.module.css";

// type Props<T extends "a" | "button"> = { tag: T } & JSX.IntrinsicElements[T];

export const Button = forwardRef<any, any>(({ tag: Tag, ...props }, ref) => {
  return <Tag ref={ref} className={style.button} {...props} />;
});
