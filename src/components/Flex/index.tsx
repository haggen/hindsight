import { ComponentPropsWithoutRef, CSSProperties } from "react";

import * as style from "./style.module.css";

import { ClassList } from "~/src/lib/classList";

type AllowedTags = "div";

type Props<E extends AllowedTags> = ComponentPropsWithoutRef<E> & {
  as?: E;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  gap?: CSSProperties["gap"];
};

export function Flex<E extends AllowedTags = "div">({
  as,
  children,
  align = "center",
  justify,
  gap,
  ...props
}: Props<E>) {
  const Component = as ?? "div";

  const classList = new ClassList();
  classList.add(style.flex);
  if (props.className) {
    classList.add(props.className);
  }
  const className = classList.toString();

  props.style ??= {
    alignItems: align,
    justifyContent: justify,
    gap,
  };

  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  );
}
