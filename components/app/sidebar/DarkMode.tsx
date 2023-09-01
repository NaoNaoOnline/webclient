import { useState, useEffect } from "react";

import { MoonIcon } from '@heroicons/react/24/outline'
import { SunIcon } from '@heroicons/react/24/outline'

const key: string = "config.naonao.online/theme"

export default function DarkMode() {
  const [them, setThem] = useState<string>("light");

  const toggleTheme = () => {
    if (them === "light") {
      setThem("dark");
      localStorage.setItem(key, "dark");
    } else {
      setThem("light");
      localStorage.setItem(key, "light");
    }
  };

  // Load the user's theme configuration from local storage when the component
  // mounts client-side.
  useEffect(() => {
    const loc = localStorage.getItem(key);
    if (loc) {
      setThem(loc);
    }
  }, []);

  useEffect(
    () => {
      document.body.className = them;
    },
    [them]
  );

  return (
    <ul className="space-y-2">
      <li>
        <div onClick={toggleTheme} className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group cursor-pointer">
          {them == "dark" && (
            <>
              <SunIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-white">Light Mode</span>
            </>
          )}
          {them == "light" && (
            <>
              <MoonIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-white">Dark Mode</span>
            </>
          )}
        </div>
      </li>
    </ul>
  );
};
