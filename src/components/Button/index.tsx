import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";
import { createStyles, type StyleProps } from "~/lib/styles";

const styles = createStyles("text-sm font-bold transition-colors", {
  variant: {
    neutral: "hover:text-stone-500",
    active: "text-lime-600 hover:text-lime-500",
    positive: "text-blue-600 hover:text-blue-400",
    negative: "text-red-600 hover:text-red-400",
  },
  disabled: {
    true: "text-stone-400 cursor-not-allowed",
  },
});

type Props = ComponentProps<"button"> &
  StyleProps<typeof styles> & {
    asChild?: boolean;
  };

export function Button({
  asChild,
  variant = "neutral",
  className,
  ...props
}: Props) {
  const Component = asChild ? Slot : "button";

  if (Component === "button") {
    props.type ??= "button";
  }

  return (
    <Component
      className={styles({ variant, disabled: props.disabled, className })}
      {...props}
    />
  );
}
