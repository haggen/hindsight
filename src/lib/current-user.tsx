import { createContext, ReactNode, useContext } from "react";
import { nanoid } from "nanoid";

import { useStoredState } from "src/lib/local-storage";

const Context = createContext({
  id: "",
});

type Props = {
  children: ReactNode;
};

const key = "current-user";

export const Provider = ({ children }: Props) => {
  const [id] = useStoredState(key, () => nanoid());

  return <Context.Provider value={{ id }}>{children}</Context.Provider>;
};

export const useCurrentUser = () => {
  return useContext(Context);
};
