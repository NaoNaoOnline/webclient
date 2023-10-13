import { createContext, useContext, useEffect } from "react";

const key: string = "theme.naonao.online/manual";

export const ManualDefault = "dark";

export const ManualContext = createContext<[
  string,
  (man: string) => void
]>([
  getManual(),
  () => { },
]);

export function getManual(): string {
  if (typeof window === "undefined") {
    return ManualDefault;
  }

  const loc = localStorage.getItem(key);
  if (loc === "light") {
    return "light";
  }
  if (loc === "dark") {
    return "dark";
  }

  return ManualDefault;
}

export function useManual(): [string, (man: string) => void] {
  const [manu, setManu] = useContext(ManualContext);

  const updManu = (man: string) => {
    setManu(man);
    localStorage.setItem(key, man);
  };

  useEffect(() => {
    document.body.className = manu;
  }, [manu]);

  // Load the user's theme configuration from local storage when the component
  // mounts client-side.
  useEffect(() => {
    setManu(getManual());
  }, [setManu]);

  return [manu, updManu];
}
