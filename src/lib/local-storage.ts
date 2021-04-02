import { useEffect, useState } from "react";

export const getLocalStorageInitializer = (key: string) => <T>(
  initialValue: T
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

export const useStoredState = <T>(key: string, initialValue: T) => {
  const initialize = getLocalStorageInitializer(key);
  const state = useState(() => initialize(initialValue));
  useLocalStorageEffect(key, state[0]);
  return state;
};
