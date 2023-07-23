"use client"

import React, { useState, useEffect } from 'react';

export default function DarkMode() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  useEffect(
    () => {
      document.body.className = theme;
    },
    [theme]
  );

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" value="" checked={theme === "dark" ? true : false} onChange={toggleTheme} className="sr-only peer"></input>
      <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none peer-focus:ring-0 rounded-full peer after:content-[''] after:absolute after:top-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-blue-600 peer-checked:bg-blue-600"></div>
      <span className="ml-3 text-gray-900 dark:text-white">Dark Mode</span>
    </label>
  );
};
