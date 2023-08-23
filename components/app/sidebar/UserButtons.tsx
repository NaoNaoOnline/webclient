import React from "react";
import { useUser } from '@auth0/nextjs-auth0/client';

import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { UserIcon } from '@heroicons/react/24/outline'

export default function UserButtons() {
  const { user } = useUser();

  const name = user?.nickname || user?.name;

  return (
    <>
      {user && (
        <ul className="pt-4 mt-4 space-y-2 border-t border-gray-300 dark:border-gray-700">
          <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
              {user.picture && (
                <div className="flex-shrink-0">
                  <img className="w-5 h-5 rounded-full" src={user.picture} alt="profile picture"></img>
                </div>
              )}
              {!user.picture && (
                <UserIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              )}
              {name && (
                <span className="flex-1 ml-3 whitespace-nowrap">{name}</span>
              )}
              {!name && (
                <span className="flex-1 ml-3 whitespace-nowrap">Profile</span>
              )}
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
              <Cog6ToothIcon className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              <span className="flex-1 ml-3 whitespace-nowrap">Settings</span>
            </a>
          </li>
        </ul>
      )}
    </>
  );
};
