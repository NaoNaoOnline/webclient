import Image from "next/image"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"

import { Cog6ToothIcon } from "@heroicons/react/24/outline"
import { UserIcon } from "@heroicons/react/24/outline"

export default function UserButtons() {
  const { user } = useUser();

  const name = user?.nickname || user?.name;

  return (
    <>
      {user && (
        <ul className="pt-4 mt-4 space-y-2 border-t border-gray-300 dark:border-gray-700">
          <li>
            <a href="#" className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group">
              {user.picture && (
                <div className="flex-shrink-0">
                  <Image
                    alt="profile picture"
                    className="w-5 h-5 rounded-full"
                    height={20}
                    width={20}
                    src={user.picture}
                  />
                </div>
              )}
              {!user.picture && (
                <UserIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
              )}
              {name && (
                <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">{name}</span>
              )}
              {!name && (
                <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">Profile</span>
              )}
            </a>
          </li>
          <li>
            <Link
              href="/settings"
              className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group"
            >
              <Cog6ToothIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
              <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">Settings</span>
            </Link>
          </li>
        </ul>
      )}
    </>
  );
};
