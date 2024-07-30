import { type DependencyList, useEffect } from "react";

export function useAsyncEffect(
  effect: () => Promise<() => void>,
  deps: DependencyList,
) {
  useEffect(() => {
    let mounted = true;
    let dispose: (() => void) | undefined;

    void (async () => {
      dispose = await effect();

      if (!mounted) {
        dispose();
      }
    })();

    return () => {
      mounted = false;
      dispose?.();
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: ...
  }, deps);
}
