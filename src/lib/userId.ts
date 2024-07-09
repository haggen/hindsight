import Cookies from "js-cookie";
import { createId } from "~/lib/createId";

export function getUserId() {
  let value = Cookies.get("userId");
  if (!value) {
    value = createId();
    Cookies.set("userId", value, {
      path: "/",
      expires: 3650,
    });
  }
  return value;
}
