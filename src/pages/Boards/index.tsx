import { Redirect } from "wouter";
import { createId } from "~/lib/createId";
import { store } from "~/lib/store";

export default function Page() {
  const boardId = createId();
  store.setRow("boards", boardId, { countdown: 0 });
  return <Redirect to={`/boards/${boardId}`} replace />;
}
