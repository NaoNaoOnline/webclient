// LastElement returns the last path element of the current page's URL, in
// decoded URI component form.
export const LastElement = (str: string): string => {
  const spl = str.split('/');

  if (spl.length > 1) {
    return decodeURIComponent(spl[spl.length - 1]);
  }

  return "";
}
