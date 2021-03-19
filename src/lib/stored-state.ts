import { useEffect, useState } from "react";

export const useStoredState = <T extends unknown>(
  key: string,
  initialValue: T
) => {
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
