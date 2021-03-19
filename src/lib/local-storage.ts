import { useEffect } from "react";

export const getLocalStorageInitializer = (key: string) => (
  initialValue: unknown
) => {
  const item = localStorage.getItem(key);
  return item
    ? JSON.parse(item)
    : typeof initialValue === "function"
    ? initialValue()
    : initialValue;
};

export const useLocalStorageEffect = (key: string, value: unknown) => {
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
};
