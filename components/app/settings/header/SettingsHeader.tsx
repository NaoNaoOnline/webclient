import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";

import { UserIcon } from "@heroicons/react/24/outline";

export default function SettingsHeader() {
  const { user } = useUser();

  const name = user?.nickname || user?.name;

  return (
    <ul className="space-y-2">
      <li className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50">
        {user?.picture && (
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
        {!user?.picture && (
          <UserIcon className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500" />
        )}
        {name && (
          <span className="flex-1 ml-3 whitespace-nowrap">{name}</span>
        )}
        {!name && (
          <span className="flex-1 ml-3 whitespace-nowrap">Profile</span>
        )}
      </li>
    </ul>
  );
};
