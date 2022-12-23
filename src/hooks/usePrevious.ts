import { useRef, useEffect } from "react";

/**
 * Reference to the given value from the previous render.
 */
export function usePrevious<T>(value: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
