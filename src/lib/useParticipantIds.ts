import { UiReact } from "~/lib/store";

export function useParticipantIds() {
  return UiReact.useRowIds("participants");
}
