import { twMerge } from "tailwind-merge";

type StyleSchema = Record<string, Record<string, string>>;

export type StyleProps<T> = T extends (props: infer P) => string ? P : never;

type ParseProp<T> = T extends "true" | "false" ? boolean : string;

export function createStyles<T extends StyleSchema>(base: string, schema: T) {
  return ({
    className,
    ...props
  }: {
    [K in keyof T]?: ParseProp<keyof T[K]>;
  } & {
    className?: string;
  }) =>
    twMerge(
      base,
      ...Object.entries(props).map(
        ([key, value]) => schema[key][String(value)],
      ),
      String(className),
    );
}
