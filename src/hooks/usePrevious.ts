import { useEffect, useRef } from "react";

/**
 * Reference to the value given in a previous render.
 */
export function usePrevious<T>(value: T) {
	const ref = useRef<T>();

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current;
}
