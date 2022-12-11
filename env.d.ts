declare module "*.module.css" {
  type Stylesheet = {
    [key: string]: string;
  };
  export default Stylesheet;
}

/**
 * Make all properties of T optional, except those in U. If exempt keys were already optional they'll stay optional.
 */
type Semipartial<T, U extends keyof T> = Partial<T> & Pick<T, U>;

/**
 * Make all properties of T required, except those in U. If exempt keys were already required they'll stay required.
 */
type Semirequired<T, U extends keyof T> = Required<T> & Pick<T, U>;
