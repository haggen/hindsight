import { ElementType } from "react";

import * as style from "./style.module.css";

import { ClassList } from "~/src/lib/classList";
import { PolymorphicComponentProps } from "~/src/lib/shared";

type Props = {
  color?: "active" | "negative" | "positive";
  bordered?: boolean;
};

export function Button<E extends "button" | "a" = "button">({
  as,
  color,
  bordered,
  ...props
}: PolymorphicComponentProps<E, Props>) {
  const Component = as ?? ("button" as ElementType);
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
  return <Component {...props} />;
}
