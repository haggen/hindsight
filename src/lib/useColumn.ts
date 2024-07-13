import { UiReact } from "~/lib/store";

export function useColumn(columnId: string) {
  return UiReact.useRow("columns", columnId);
}
