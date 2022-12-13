/**
 * Set of strings that can assigned to element's className.
 */
export class ClassList extends Set {
  toString() {
    return Array.from(this).filter(Boolean).join(" ");
  }
}
