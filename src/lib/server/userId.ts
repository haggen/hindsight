import { createId } from "@/lib/shared/createId";
import { cookies } from "next/headers";
import { cache } from "react";

const acquireUserId = cache(createId);

export function getUserId() {
  const cookie = cookies().get("userId");

  if (cookie) {
    return cookie.value;
  }

  const userId = acquireUserId();

  cookies().set({
    name: "userId",
    value: userId,
    expires: 60 * 60 * 24 * 365,
    httpOnly: true,
  });

  return userId;
}
