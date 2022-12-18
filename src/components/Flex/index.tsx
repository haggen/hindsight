import { CSSProperties, ElementType } from "react";

import * as classes from "./style.module.css";

import { ClassList } from "~/src/lib/classList";
import { PolymorphicComponentProps } from "~/src/lib/shared";

type AcceptableElementType = "div" | "ul" | "header" | "menu";

type Props = {
  direction?: CSSProperties["flexDirection"];
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  gap?: CSSProperties["gap"];
};

export function Flex<E extends AcceptableElementType = "div">({
  as,
  children,
  direction,
  align = "center",
  justify,
  gap,
  ...props
}: PolymorphicComponentProps<E, Props>) {
  const Component = as ?? ("div" as ElementType);

  const classList = new ClassList();
  classList.add(classes.flex);
  if (props.className) {
    classList.add(props.className);
  }
  props.className = classList.toString();

  props.style = {
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    gap,
    ...props.style,
  };

  return <Component {...props}>{children}</Component>;
}
