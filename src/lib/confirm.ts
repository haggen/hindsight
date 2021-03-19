export const confirm = (message: string) => {
  if (typeof window !== undefined) {
    return window.confirm(message);
  }
  return false;
};
