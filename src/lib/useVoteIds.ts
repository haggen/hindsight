import { UiReact } from "~/lib/store";

export function useVoteIdsByCardId(cardId: string) {
  return UiReact.useSliceRowIds("votesByCardId", cardId);
}

export function useVoteIdsByBoardId(boardId: string) {
  return UiReact.useSliceRowIds("votesByBoardId", boardId);
}
