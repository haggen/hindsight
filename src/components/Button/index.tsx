import type { ComponentProps, ElementType } from "react";
import { Link } from "wouter";

const variants = {
  neutral: "",
  active: "text-purple-600",
  positive: "text-green-600",
  negative: "text-red-600",
};

// biome-ignore lint/complexity/noBannedTypes: <explanation>
function hasHref(props: {}): props is ComponentProps<typeof Link> {
  return "href" in props;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AcceptableElements = ElementType<any, "button"> | typeof Link;

type Props<E extends AcceptableElements> = {
  as?: E;
  variant?: "neutral" | "active" | "positive" | "negative";
} & Omit<ComponentProps<AcceptableElements>, "variant">;

export function Button<E extends AcceptableElements>({
  as = "button" as E,
  variant = "neutral",
  ...props
}: Props<E>) {
  props.className = `text-sm font-bold ${variants[variant]} ${props.className}`;

  if (hasHref(props)) {
    return <Link {...props} />;
  }

  props.type ??= "button";

  return <button {...props} />;
}
