import { ComponentPropsWithoutRef } from "react";

import * as style from "./style.module.css";

import { ClassList } from "~/src/lib/classList";

type Props = ComponentPropsWithoutRef<"button"> & {
  color?: "active" | "negative" | "positive";
  bordered?: boolean;
};

export function Button({ color, bordered, ...props }: Props) {
  const classList = new ClassList();
  classList.add(style.button);
  if (color) {
    classList.add(style[color]);
  }
  if (bordered) {
    classList.add(style.bordered);
  }
  props.type ??= "button";
  props.className ??= classList.toString();
  return <button {...props} />;
}
