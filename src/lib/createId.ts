import { customAlphabet } from "nanoid";

/**
 * Create fairly unique and URL friendly ID.
 */
export const createId = customAlphabet("0123456789bcdfghjklmnpqrstvwxyz", 10);
