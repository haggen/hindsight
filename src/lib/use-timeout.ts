import { useEffect, useRef } from "react";

export const useTimeout = (callback: () => void, delay: number) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!delay) {
      return;
    }

    const id = setTimeout(() => {
      callbackRef.current();
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [delay]);
};
