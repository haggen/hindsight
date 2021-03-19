import { useEffect, useRef } from "react";

export const useInterval = (callback: () => void, interval: number) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!interval) {
      return;
    }

    const id = setInterval(() => {
      callbackRef.current();
    }, interval);

    return () => {
      clearInterval(id);
    };
  }, [interval]);
};
