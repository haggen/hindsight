import { useState, useCallback } from "react";

/**
 * Force component update.
 */
export function useForceUpdate() {
  const [, update] = useState({});
  return useCallback(() => update({}), []);
}
