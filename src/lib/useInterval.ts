import { useEffect, useRef } from "react";

export function useInterval<T extends (...a: unknown[]) => unknown>(
  callback: T,
  rate: number,
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const interval = setInterval(() => {
      callbackRef.current();
    }, rate);

    return () => {
      clearInterval(interval);
    };
  }, [rate]);
}
