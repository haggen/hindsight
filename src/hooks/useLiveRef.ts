import { useEffect, useRef } from "react";

/**
 * Live reference to a value.
 */
export function useLiveRef<T>(value: T) {
	const ref = useRef(value);
	useEffect(() => {
		ref.current = value;
	}, [value]);
	return ref;
}
