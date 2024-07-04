import { cookies } from "next/headers";

export function getUserId() {
  const userId = cookies().get("userId");

  if (!userId) {
    throw new Error(`Cookie "userId" is missing`);
  }

  return userId.value;
}
