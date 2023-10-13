import { useEffect, useState } from "react";

import { MoonIcon } from "@heroicons/react/24/outline";
import { SunIcon } from "@heroicons/react/24/outline";

import { useManual } from "@/components/app/theme/ManualTheme";
import { useSystem } from "@/components/app/theme/SystemTheme";

export default function DarkMode() {
  const [manu, setManu] = useManual();
  const [rndr, setRndr] = useState(false);
  const [syst, setSyst] = useSystem();

  const onClick = () => {
    setManu(manu === "light" ? "dark" : "light");
    setSyst(false);
  };

  // We need to keep track of the rendered state here because of the way our
  // theme handling works. If we do not prevent rendering before the client is
  // ready, then we get hydration errors and the app crashes, since manu
  // diverges between client and server, probably due to effects of applying
  // local storage state.
  useEffect(() => {
    setRndr(true);
  }, []);

  return (
    <ul className="space-y-2">
      <li>
        {!rndr && (
          <></>
        )}
        {rndr && (
          <div onClick={onClick} className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group cursor-pointer">
            {manu === "dark" && (
              <>
                <SunIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
                <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">Light Mode</span>
              </>
            )}
            {manu === "light" && (
              <>
                <MoonIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
                <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">Dark Mode</span>
              </>
            )}
          </div>
        )}
      </li>
    </ul>
  );
};
