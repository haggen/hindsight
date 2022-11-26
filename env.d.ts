declare module "*.css";

/**
 * Make all properties of T optional, except those in U.
 */
type Semipartial<T, U extends keyof T> = Partial<T> & Pick<T, U>;
