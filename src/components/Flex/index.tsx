import { CSSProperties, ElementType } from "react";

import * as style from "./style.module.css";

import { ClassList } from "~/src/lib/classList";
import { PolymorphicComponentProps } from "~/src/lib/shared";

type AcceptableElementType = "div" | "ul";

type Props = {
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  gap?: CSSProperties["gap"];
};

export function Flex<E extends AcceptableElementType = "div">({
  as,
  children,
  align = "center",
  justify,
  gap,
  ...props
}: PolymorphicComponentProps<E, Props>) {
  const Component = as ?? ("div" as ElementType);

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
