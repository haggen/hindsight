import { CSSProperties, ElementType, forwardRef } from "react";

import * as classes from "./style.module.css";

import { ClassList } from "~/src/lib/classList";
import { PolymorphicPropsWithRef, PolymorphicRef } from "~/src/lib/shared";

type AcceptableElementType = "div" | "ul" | "header" | "menu";

type Props = {
  direction?: CSSProperties["flexDirection"];
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  gap?: CSSProperties["gap"];
};

function Flex<E extends AcceptableElementType = "div">(
  {
    as,
    children,
    direction,
    align = direction !== "column" ? "center" : undefined,
    justify,
    gap,
    ...props
  }: PolymorphicPropsWithRef<E, Props>,
  ref: PolymorphicRef<E>
) {
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

  return (
    <Component ref={ref} {...props}>
      {children}
    </Component>
  );
}

// Fix the type of the forwarded component.
const forwardRefFlex = forwardRef(Flex) as typeof Flex;
export { forwardRefFlex as Flex };
