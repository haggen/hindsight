import { UiReact } from "~/lib/store";

export function useCardIds(boardId: string) {
  return UiReact.useSliceRowIds("columnsByBoardId", boardId);
}
