import { UiReact } from "~/lib/store";

export function useBoard(boardId: string) {
  return UiReact.useRow("boards", boardId);
}

export function useBoardIdByCardId(cardId: string) {
  const columnId = UiReact.useRemoteRowId("cardsColumn", cardId);
  if (!columnId) {
    throw new Error(
      `Can't find remote column row for local card row "${JSON.stringify(
        cardId,
      )}"`,
    );
  }
  const boardId = UiReact.useRemoteRowId("columnsBoard", columnId);
  if (!boardId) {
    throw new Error(
      `Can't find remote board row for local column row "${JSON.stringify(
        columnId,
      )}"`,
    );
  }
  return boardId;
}
