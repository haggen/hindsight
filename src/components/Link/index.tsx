import type { ComponentProps } from "preact";
import { Link as WouterLink } from "wouter";

export function Link(props: ComponentProps<typeof WouterLink>) {
  props.class = `font-bold text-sm ${props.class}`;
  return <WouterLink {...props} />;
}
