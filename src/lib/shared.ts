import { ElementType, ComponentPropsWithoutRef } from "react";

/**
 * Extend component properties with an `as` property and the selected element intrinsic attributes.
 */
export type PolymorphicComponentProps<
  E extends ElementType,
  P extends object
> = {
  as?: E;
} & Omit<P, "as"> &
  Omit<ComponentPropsWithoutRef<E>, keyof P | "as">;
