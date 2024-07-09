import { createContext, useContext } from "react";

type Value = {
  userId: string;
};

export const Global = createContext<Value>({
  userId: "",
});

export function useUserId() {
  return useContext(Global).userId;
}
