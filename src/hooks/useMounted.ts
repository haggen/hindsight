import { useEffect, useRef } from "react";

/**
 * Tell if component is mounted or not.
 */
export function useMounted() {
	const mounted = useRef(false);
	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);
	return mounted.current;
}
