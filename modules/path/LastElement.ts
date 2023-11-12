// LastElement returns the last path element of the current page's URL.
export const LastElement = (str: string): string => {
  const spl = str.split('/');

  if (spl.length > 1) {
    return spl[spl.length - 1];
  }

  return "";
}
