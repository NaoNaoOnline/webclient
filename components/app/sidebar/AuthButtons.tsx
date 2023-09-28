import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"

import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline"
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline"

export default function AuthButtons() {
  const { user } = useUser();

  return (
    <ul className="pt-4 mt-4 space-y-2 border-t border-gray-300 dark:border-gray-700">
      <li>
        {user && (
          <Link
            href="/api/auth/logout"
            className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group"
          >
            <ArrowLeftOnRectangleIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
            <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">Logout</span>
          </Link>
        )}
        {!user && (
          <Link
            href="/api/auth/login"
            className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group"
          >
            <ArrowRightOnRectangleIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
            <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">Login</span>
          </Link>
        )}
      </li>
    </ul>
  );
};