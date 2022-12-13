/**
 * Pluralize expression based on a count.
 */
export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`
) {
  return count === 1 ? singular : plural;
}
