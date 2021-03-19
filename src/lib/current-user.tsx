import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { nanoid } from "nanoid";

import {
  getLocalStorageInitializer,
  useLocalStorageEffect,
} from "src/lib/local-storage";

const Context = createContext({
  id: "",
});

type Props = {
  children: ReactNode;
};

const key = "current-user";

export const Provider = ({ children }: Props) => {
  const [id, setId] = useState(getLocalStorageInitializer(key));

  useEffect(() => {
    if (!id) {
      setId(nanoid());
    }
  }, [id, setId]);

  useLocalStorageEffect(key, id);

  return <Context.Provider value={{ id }}>{children}</Context.Provider>;
};

export const useCurrentUser = () => {
  return useContext(Context);
};
