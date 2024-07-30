import Cookies from "js-cookie";
import { createId } from "~/lib/createId";

export function getParticipantId() {
  let value = Cookies.get("participantId");
  if (!value) {
    value = createId();

    Cookies.set("participantId", value, {
      path: "/",
      expires: 3650,
    });
  }
  return value;
}
