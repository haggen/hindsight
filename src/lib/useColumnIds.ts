import { UiReact } from "~/lib/store";

export function useColumnIds() {
  return UiReact.useRowIds("columns");
}
