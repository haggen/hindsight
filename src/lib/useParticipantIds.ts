import { UiReact } from "~/lib/store";

export function useParticipantIds(boardId: string) {
  return UiReact.useSliceRowIds("participantsByBoardId", boardId);
}
