import React from "react";

import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function LoginButton() {
  return (
    <a href="/api/auth/login" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-white dark:hover:bg-gray-700 group">
      <ArrowRightOnRectangleIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
      <span className="flex-1 ml-3 whitespace-nowrap">Login</span>
    </a>
  );
};
