/**
 * Get a throttled version of a function that run at most once every `delay` milliseconds.
 */
export function throttled<P extends unknown[], R>(
  func: (...args: P) => R,
  delay: number
) {
  let checkpoint = 0;
  return (...args: P) => {
    const now = Date.now();
    if (checkpoint + delay > now) {
      return;
    }
    checkpoint = now;
    return func(...args);
  };
}
