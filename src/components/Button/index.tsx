import { ComponentPropsWithoutRef } from "react";

import * as style from "./style.module.css";

export function Button({ ...props }: ComponentPropsWithoutRef<"button">) {
  props.type ??= "button";
  props.className ??= style.button;
  return <button {...props} />;
}
