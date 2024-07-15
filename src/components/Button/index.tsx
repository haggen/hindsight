import type { ComponentPropsWithRef, ElementType, ForwardedRef } from "react";
import { Link } from "wouter";
import { type DistributiveOmit, fixedForwardRef } from "~/lib/react";

const variants = {
  neutral: "hover:text-stone-500",
  active: "text-lime-700 hover:text-lime-600",
  positive: "text-blue-600 hover:text-blue-400",
  negative: "text-red-600 hover:text-red-400",
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type AcceptableElements = typeof Link | ElementType<any, "a" | "button">;

type Props<E extends AcceptableElements> = {
  as?: E;
  variant?: "neutral" | "active" | "positive" | "negative";
  disabled?: boolean;
} & DistributiveOmit<
  ComponentPropsWithRef<ElementType extends E ? "a" : E>, // This "a" makes no sense but it works.
  "as" | "variant" | "disabled"
>;

function Button<E extends AcceptableElements>(
  { as, variant = "neutral", ...props }: Props<E>,
  ref: ForwardedRef<E>,
) {
  const Component = as ?? ("href" in props ? (Link as E) : "button");

  props.className = `${props.className} text-sm font-bold transition-colors`;

  if (props.disabled) {
    props.className = `${props.className} text-stone-400 cursor-not-allowed`;
  } else {
    props.className = `${props.className} ${variants[variant]}`;
  }

  if (Component === "button") {
    props.type ??= "button";
  } else if (props.disabled) {
    props.href = "";
    props.disabled = undefined;
  }

  return <Component {...props} ref={ref} />;
}

const forwardedButton = fixedForwardRef(Button);

export { forwardedButton as Button };
