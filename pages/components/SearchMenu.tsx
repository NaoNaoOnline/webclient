import React from 'react';

import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { HomeIcon } from '@heroicons/react/24/outline'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/outline'
import { UsersIcon } from '@heroicons/react/24/outline'

export default function SearchMenu() {
  return (
    <div className="pl-4 pr-4 mt-4 md:ml-64">
      <div className="pl-4 pr-4 flex grid justify-items-center">
        <div className="rounded-lg w-full max-w-2xl">

          <ul className="flex flex-row w-full">
            <li className="flex items-center md:hidden mr-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 group">
              <button className="p-2" data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button">
                <Bars3BottomLeftIcon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              </button>
            </li>

            <li className="w-full">
              <input className="p-2 w-full border-none rounded-lg bg-gray-200 placeholder-gray-400 dark:placeholder-gray-500 dark:text-white dark:bg-gray-800" type="text" id="search-navbar" placeholder="Search" />
            </li>

            <li className="flex items-center ml-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 group">
              <button className="p-2" type="button">
                <LockClosedIcon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              </button>
            </li>
            <li className="flex items-center ml-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 group">
              <button className="p-2" type="button">
                <UsersIcon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              </button>
            </li>
            <li className="flex items-center ml-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 group">
              <button className="p-2" type="button">
                <StarIcon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              </button>
            </li>
            <li className="flex items-center ml-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 group">
              <button className="p-2" type="button">
                <HomeIcon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              </button>
            </li>
          </ul>

        </div>
      </div>
    </div>
  );
};
