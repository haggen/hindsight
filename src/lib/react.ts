import {
  forwardRef,
  type ReactNode,
  type Ref,
  type RefAttributes,
} from "react";

// biome-ignore lint/complexity/noBannedTypes: ...
type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: Ref<T>) => ReactNode,
) => (props: P & RefAttributes<T>) => ReactNode;

export const fixedForwardRef = forwardRef as FixedForwardRef;

// biome-ignore lint/suspicious/noExplicitAny: ...
export type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends any
  ? Omit<T, TOmitted>
  : never;
