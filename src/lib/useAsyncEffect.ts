import { type DependencyList, useEffect, useMemo } from "react";

export function useAsyncEffect(
  effect: () => Promise<() => void>,
  deps: DependencyList,
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const stableEffect = useMemo(() => effect, deps);

  useEffect(() => {
    let disposed = false;
    let dispose: () => void;

    void (async () => {
      dispose = await stableEffect();

      if (disposed) {
        void dispose();
      }
    })();

    return () => {
      disposed = true;
      dispose?.();
    };
  }, [stableEffect]);
}
