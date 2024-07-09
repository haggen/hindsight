import { createId } from "@/lib/shared/createId";
import { cookies } from "next/headers";
import { cache } from "react";

const acquireUserId = cache(createId);

export function getUserId() {
  const cookie = cookies().get("userId");

  if (cookie) {
    return cookie.value;
  }

  return acquireUserId();
}
