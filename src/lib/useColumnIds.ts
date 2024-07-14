import { UiReact } from "~/lib/store";

export function useColumnIdsByBoardId(boardId: string) {
  return UiReact.useSliceRowIds("columnsByBoardId", boardId);
}
