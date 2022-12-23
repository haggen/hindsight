import { useCallback, useEffect, useRef } from "react";

import { useLiveRef } from "~/src/hooks/useLiveRef";

/**
 * Run callback on every frame. Doesn't update component though.
 */
export function useRaf(callback: (elapsed: number) => void) {
  const callbackRef = useLiveRef(callback);
  const rafRef = useRef(0);

  const handler = useCallback(
    (elapsed: number) => {
      callbackRef.current(elapsed);
      rafRef.current = requestAnimationFrame(handler);
    },
    [callbackRef]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(handler);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [handler]);
}
