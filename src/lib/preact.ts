import type { ComponentProps, JSX } from "preact";

/**
 * Forward reference type for a polymorphic component.
 */
export type PolymorphicRef<E extends JSX.ElementType> =
  ComponentProps<E>["ref"];

/**
 * Like ComponentProps but for forwardRef components.
 */
export type PolymorphicProps<E extends JSX.ElementType, P extends object> = {
  as?: E;
  ref?: PolymorphicRef<E>;
} & Omit<P, "as"> &
  Omit<ComponentProps<E>, keyof P | "as" | "ref">;
