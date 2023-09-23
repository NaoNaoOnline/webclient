import { createContext, useContext, useEffect } from "react";

export const ThemeContext = createContext<[
  string,
  (theme: string) => void
]>([
  '',
  () => { },
]);

const key: string = "config.naonao.online/theme"

export function useTheme(): [string, () => void] {
  const [them, setThem] = useContext(ThemeContext);

  const tglThem = () => {
    const newTheme = them === "light" ? "dark" : "light";
    setThem(newTheme);
    localStorage.setItem(key, newTheme);
  };

  useEffect(() => {
    document.body.className = them;
  }, [them]);

  // Load the user's theme configuration from local storage when the component
  // mounts client-side.
  useEffect(() => {
    const loc = localStorage.getItem(key);
    if (loc) {
      setThem(loc);
    }
  }, [setThem]);

  return [them, tglThem];
}
