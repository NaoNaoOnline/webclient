import { MouseEvent, useEffect, useState } from "react";

import Image from "next/image";

import { RiNotification2Line } from "react-icons/ri";
import { FiLogIn } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { IoSettingsOutline } from "react-icons/io5";
import { TbMoon } from "react-icons/tb";
import { TbSunHigh } from "react-icons/tb";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { ActiveButton } from "@/components/app/sidebar/ActiveButton";
import { useManual } from "@/components/app/theme/ManualThemeProvider";
import { useSystem } from "@/components/app/theme/SystemThemeProvider";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastProvider";

export function UserButtons() {
  const { addInfo } = useToast();
  const { auth, imag, name } = useAuth();

  const [manu, setManu] = useManual();
  const [rndr, setRndr] = useState(false);
  const [syst, setSyst] = useSystem();

  const reqAuth = (str: string) => {
    return (evn: MouseEvent<HTMLAnchorElement>) => {
      if (!auth) {
        evn.preventDefault();
        addInfo(new InfoPropsObject(str));
      }
    };
  };

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
      <ul className="pt-4 mt-4 border-t border-gray-50 dark:border-gray-700">

        {auth && (
          <ActiveButton
            href={"/user/" + name}
            text={name}
            icon={
              <Image
                alt="profile picture"
                height={20}
                width={20}
                src={imag}
              />
            }
            clck={reqAuth("Oh, this door is locked! Try logging in first.")}
          />
        )}

        <li>
          <ActiveButton
            href="/comingsoon?page=notifications"
            text="Notifications"
            icon={<RiNotification2Line />}
            clck={reqAuth("Oh, this door is locked! Try logging in first.")}
          />
        </li>

        {rndr && (
          <div
            onClick={onClick}
            className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group"
          >
            {manu === "dark" && (
              <>
                <TbSunHigh
                  className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50"
                />
                <span
                  className="flex-1 ml-3 whitespace-nowrap text-gray-500 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50"
                >
                  Light Mode
                </span>
              </>
            )}
            {manu === "light" && (
              <>
                <TbMoon
                  className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50"
                />
                <span
                  className="flex-1 ml-3 whitespace-nowrap text-gray-500 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50"
                >
                  Dark Mode
                </span>
              </>
            )}
          </div>
        )}

        {auth && (
          <li>
            <ActiveButton
              href="/settings"
              text="Settings"
              icon={<IoSettingsOutline />}
            />
          </li>
        )}

        {auth && (
          <li>
            <ActiveButton
              href="/api/auth/logout"
              text="Logout"
              icon={<FiLogOut />}
            />
          </li>
        )}
        {!auth && (
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
