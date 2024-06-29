import { useEffect } from "react";

import { useLiveRef } from "~/src/hooks/useLiveRef";

/**
 * Execute callback periodically.
 */
export function useInterval(callback: () => void, delay: number) {
	const callbackRef = useLiveRef(callback);

	useEffect(() => {
		if (delay === 0) {
			return;
		}
		const id = setInterval(() => callbackRef.current(), delay);
		return () => clearInterval(id);
	}, [callbackRef, delay]);
}
