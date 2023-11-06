import { MouseEvent, useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

import { CgAddR } from "react-icons/cg";
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { TbMoon } from "react-icons/tb";
import { TbSunHigh } from "react-icons/tb";
import { UserIcon } from "@heroicons/react/24/outline";

import { ActiveButton } from "@/components/app/sidebar/ActiveButton";

import { useManual } from "@/components/app/theme/ManualTheme";
import { useSystem } from "@/components/app/theme/SystemTheme";

import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastContext";

import { useToken } from "@/components/app/token/TokenContext";

export function UserButtons() {
  const { addInfo } = useToast();
  const { auth } = useToken();
  const { user } = useUser();

  const [manu, setManu] = useManual();
  const [rndr, setRndr] = useState(false);
  const [syst, setSyst] = useSystem();

  const newOnLinkClick = (str: string) => {
    return (evn: MouseEvent<HTMLAnchorElement>) => {
      if (!auth) {
        evn.preventDefault();
        addInfo(new InfoPropsObject(str));
      }
    };
  }

  const onClick = () => {
    setManu(manu === "light" ? "dark" : "light");
    setSyst(false);
  };

  // We need to keep track of the rendered state here because of the way our
  // theme handling works. If we do not prevent rendering before the client is
  // ready, then we get hydration errors and the app crashes, since manu
  // diverges between client and server, probably due to effects of applying
  // local storage state. If somebody finds a way to handle this in a better way
  // please create a pull request.
  useEffect(() => {
    setRndr(true);
  }, []);

  return (
    <>
      <ul className="pt-4 mt-4 border-t border-gray-300 dark:border-gray-700">

        {user && (
          <li>
            <Link
              href={`/user/` + user?.public?.name}
              className="flex items-center p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer group"
            >
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
                <UserIcon
                  className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50"
                />
              )}
              {user?.public?.name && (
                <span
                  className="flex-1 ml-3 whitespace-nowrap text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50"
                >
                  {user?.public?.name}
                </span>
              )}
              {!user?.public?.name && (
                <span
                  className="flex-1 ml-3 whitespace-nowrap text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50"
                >
                  Profile
                </span>
              )}
            </Link>
          </li>
        )}

        <li>
          <ActiveButton
            href="/event/create"
            text="Add Event"
            icon={<CgAddR />}
            clck={newOnLinkClick("Join the beavers and login if you want to add a new event. Or else!")}
          />
        </li>

        {rndr && (
          <div
            onClick={onClick}
            className="flex items-center p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer group"
          >
            {manu === "dark" && (
              <>
                <TbSunHigh
                  className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50"
                />
                <span
                  className="flex-1 ml-3 whitespace-nowrap text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50"
                >
                  Light Mode
                </span>
              </>
            )}
            {manu === "light" && (
              <>
                <TbMoon
                  className="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50"
                />
                <span
                  className="flex-1 ml-3 whitespace-nowrap text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50"
                >
                  Dark Mode
                </span>
              </>
            )}
          </div>
        )}

        {user && (
          <li>
            <ActiveButton
              href="/settings"
              text="Settings"
              icon={<IoSettingsOutline />}
            />
          </li>
        )}

        {user && (
          <li>
            <ActiveButton
              href="/api/auth/logout"
              text="Logout"
              icon={<FiLogOut />}
            />
          </li>
        )}
        {!user && (
          <li>
            <ActiveButton
              href="/api/auth/login"
              text="Login"
              icon={<FiLogIn />}
            />
          </li>
        )}

      </ul>
    </>
  );
};
