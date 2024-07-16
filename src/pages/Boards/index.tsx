import { Redirect } from "wouter";
import { createId } from "~/lib/createId";

export default function Page() {
  const boardId = createId();
  return <Redirect to={`/boards/${boardId}`} replace />;
}
