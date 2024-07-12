import type {
  ComponentPropsWithRef,
  ComponentPropsWithoutRef,
  ElementType,
} from "react";

/**
 * Extend component properties with an `as` property and the selected element intrinsic attributes.
 */
export type PolymorphicPropsWithoutRef<
  E extends ElementType,
  P extends object,
> = {
  as?: E;
} & Omit<P, "as"> &
  Omit<ComponentPropsWithoutRef<E>, keyof P | "as">;

/**
 * Like ComponentPropsWithoutRef but for forwardRef components.
 */
export type PolymorphicPropsWithRef<E extends ElementType, P extends object> = {
  as?: E;
  ref?: PolymorphicRef<E>;
} & Omit<P, "as"> &
  Omit<ComponentPropsWithoutRef<E>, keyof P | "as" | "ref">;

/**
 * Forward reference type for a polymorphic component.
 */
export type PolymorphicRef<E extends ElementType> =
  ComponentPropsWithRef<E>["ref"];
