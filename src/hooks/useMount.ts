import { useRef, useEffect } from "react";

/**
 * Tell if component is mounted or not.
 */
export function useMount() {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return mounted.current;
}
