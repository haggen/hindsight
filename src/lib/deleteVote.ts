import type { Id } from "tinybase";
import { store } from "~/lib/store";

export function deleteVote(voteId: Id) {
  store.delRow("votes", voteId);
}
