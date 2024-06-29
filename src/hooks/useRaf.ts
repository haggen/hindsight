import { useCallback, useEffect, useRef } from "react";

import { useLiveRef } from "~/src/hooks/useLiveRef";
import { useMounted } from "~/src/hooks/useMounted";

/**
 * Run callback on every frame. Doesn't update component though.
 */
export function useRaf(callback: (elapsed: number) => void) {
	const mounted = useMounted();
	const callbackRef = useLiveRef(callback);
	const rafRef = useRef(0);

	const handler = useCallback(
		(elapsed: number) => {
			if (!mounted) {
				return;
			}
			callbackRef.current(elapsed);
			rafRef.current = requestAnimationFrame(handler);
		},
		[callbackRef],
	);

	useEffect(() => {
		rafRef.current = requestAnimationFrame(handler);
		return () => {
			cancelAnimationFrame(rafRef.current);
		};
	}, [handler]);
}
