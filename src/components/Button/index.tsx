import type { ComponentProps } from "preact";

export function Button(props: ComponentProps<"button">) {
  props.type ??= "button";
  props.class = `font-bold text-sm ${props.class}`;
  return <button {...props} />;
}
