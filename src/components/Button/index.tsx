import type { ComponentProps } from "react";

export function Button({ ...props }: ComponentProps<"button">) {
  props.type ??= "button";
  props.className = `font-bold text-sm ${props.className}`;
  return <button {...props} />;
}
