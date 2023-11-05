import "flowbite";
import { MouseEvent } from "react";
import Link from "next/link";

import { FaceSmileIcon } from "@heroicons/react/24/outline";
import { HomeIcon } from "@heroicons/react/24/outline";
import { ListBulletIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";

import DarkMode from "@/components/app/sidebar/DarkMode";
import AuthButtons from "@/components/app/sidebar/AuthButtons";
import SocialButtons from "@/components/app/sidebar/SocialButtons";
import UserButtons from "@/components/app/sidebar/UserButtons";

import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastContext";

import { useToken } from "@/components/app/token/TokenContext";

export default function Sidebar() {
  const { addInfo } = useToast();
  const { auth } = useToken();

  const newOnLinkClick = (str: string) => {
    return (evn: MouseEvent<HTMLAnchorElement>) => {
      if (!auth) {
        evn.preventDefault();
        addInfo(new InfoPropsObject(str));
      }
    };
  }

  return (
    <aside
      id="default-sidebar"
      className="fixed top-0 left-0 z-50 w-64 h-screen transition-transform -translate-x-full md:translate-x-0"
      aria-label="Sidebar"
      aria-hidden
    >
      <div className="h-full px-4 py-4 shadow-gray-400 dark:shadow-black shadow-[0_0_2px] overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <DarkMode />

        <ul className="pt-4 mt-4 space-y-2 border-t border-gray-300 dark:border-gray-700">
          <li>
            <Link
              href="/"
              className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group"
            >
              <HomeIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
              <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">Default View</span>
            </Link>
          </li>
          <li>
            <Link
              href="/event/add"
              onClick={newOnLinkClick("Join the beavers and login if you want to add a new event. Or else!")}
              className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group"
            >
              <PlusIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
              <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">Add Event</span>
            </Link>
          </li>
          <li>
            <Link
              href="/list"
              onClick={newOnLinkClick("You can't come in honey, maybe login and try again, maybe, but I don't know!")}
              className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group"
            >
              <ListBulletIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
              <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">My Lists</span>
            </Link>
          </li>
          <li>
            <Link
              href="/reaction"
              onClick={newOnLinkClick("Login if you want to see the events you reacted to. The beavers are stubborn about it!")}
              className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group"
            >
              <FaceSmileIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
              <span className="flex-1 ml-3 whitespace-nowrap dark:group-hover:text-gray-50">My Reactions</span>
            </Link>
          </li>
        </ul>

        <UserButtons />
        <AuthButtons />
        <SocialButtons />
      </div>
    </aside>
  );
};
