import React, { useState, useEffect } from "react";

import { MoonIcon } from '@heroicons/react/24/outline'
import { SunIcon } from '@heroicons/react/24/outline'

export default function DarkMode() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(
    () => {
      document.body.className = theme;
    },
    [theme]
  );

  return (
    <div onClick={toggleTheme} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group cursor-pointer">
      {theme == "dark" && (
        <>
          <SunIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          <span className="flex-1 ml-3 whitespace-nowrap">Light Mode</span>
        </>
      )}
      {theme == "light" && (
        <>
          <MoonIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          <span className="flex-1 ml-3 whitespace-nowrap">Dark Mode</span>
        </>
      )}
    </div>
  );
};
