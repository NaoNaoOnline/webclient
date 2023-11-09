import { createContext, useContext, useEffect } from "react";

import { useManual } from "@/components/app/theme/ManualThemeProvider";

const systKey: string = "theme.naonao.online/system";

export const SystemDefault = true;

export const SystemContext = createContext<[
  boolean,
  (sys: boolean) => void
]>([
  getSystem(),
  () => { },
]);

export function getSystem(): boolean {
  if (typeof window === "undefined") {
    return SystemDefault;
  }

  const loc = localStorage.getItem(systKey);
  if (!loc) {
    return SystemDefault;
  }

  if (loc.toLowerCase() === "true") {
    return true;
  }
  if (loc.toLowerCase() === "false") {
    return false;
  }

  return SystemDefault;
}

export function useSystem(): [boolean, (sys: boolean) => void] {
  const [manu, setManu] = useManual();
  const [syst, setSyst] = useContext(SystemContext);

  // Provide an external setter for directly changing the internal state from
  // the outside.
  const updSyst = (sys: boolean) => {
    setSyst(sys);
    localStorage.setItem(systKey, String(sys));
  };

  useEffect(() => {
    if (syst) {
      const qry = window.matchMedia("(prefers-color-scheme: dark)");

      // Sync with system theme when the user changes the app settings manually
      // in the webclient settings.
      if (qry.matches) {
        setManu("dark");
      } else {
        setManu("light");
      }

      // Sync with system theme when the user changes the systems settings
      // manually in the OS settings.
      const onChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          setManu("dark");
        } else {
          setManu("light");
        }
      };

      // Sync with system theme when the user visits the open browser tab again.
      const onVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          if (qry.matches) {
            setManu("dark");
          } else {
            setManu("light");
          }
        }
      };

      qry.addEventListener("change", onChange);
      document.addEventListener("visibilitychange", onVisibilityChange);

      return () => {
        qry.removeEventListener("change", onChange);
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    }
  }, [syst, setManu]);

  // Load the user's theme configuration from local storage when the component
  // mounts client-side.
  useEffect(() => {
    setSyst(getSystem());
  }, [setSyst]);

  return [syst, updSyst];
}
