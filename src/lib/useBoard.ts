import { UiReact } from "~/lib/store";

export function useBoard(boardId: string) {
  return UiReact.useRow("boards", boardId);
}
