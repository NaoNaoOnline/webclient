import { MouseEvent, useEffect, useState } from "react";

import Image from "next/image";

import { LogInIcon } from "@/components/app/icon/base/LogInIcon";
import { LogOutIcon } from "@/components/app/icon/base/LogOutIcon";
import { MoonLineIcon } from "@/components/app/icon/base/MoonLineIcon";
import { SettingsLineIcon } from "@/components/app/icon/base/SettingsLineIcon";
import { SunLineIcon } from "@/components/app/icon/base/SunLineIcon";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { PremiumButton } from "@/components/app/button/PremiumButton";
import { useCache } from "@/components/app/cache/CacheProvider";
import { ActiveButton } from "@/components/app/sidebar/ActiveButton";
import { useManual } from "@/components/app/theme/ManualThemeProvider";
import { useSystem } from "@/components/app/theme/SystemThemeProvider";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastProvider";

export function UserButtons() {
  const { auth, imag, name } = useAuth();
  const { user } = useCache();
  const { addInfo } = useToast();

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
          <li
            className="relative flex"
          >
            <ActiveButton
              href={"/user/" + name}
              text={
                <PremiumButton
                  name={user?.name}
                  prem={user?.prem}
                />
              }
              icon={
                <Image
                  className="rounded-full "
                  alt="profile picture"
                  height={20}
                  width={20}
                  src={imag}
                />
              }
              clck={reqAuth("Oh, this door is locked! Try logging in first.")}
            />
          </li>
        )}

        {rndr && (
          <li
            onClick={onClick}
            className="relative flex mx-4 items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer group"
          >
            {manu === "dark" && (
              <>
                <SunLineIcon
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
                <MoonLineIcon
                  className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50"
                />
                <span
                  className="flex-1 ml-3 whitespace-nowrap text-gray-500 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50"
                >
                  Dark Mode
                </span>
              </>
            )}
          </li>
        )}

        {auth && (
          <li
            className="relative flex"
          >
            <ActiveButton
              href="/settings"
              text={<>Settings</>}
              icon={<SettingsLineIcon />}
            />
          </li>
        )}

        {auth && (
          <li
            className="relative flex"
          >
            <ActiveButton
              href="/api/auth/logout"
              text={<>Logout</>}
              icon={<LogOutIcon />}
            />
          </li>
        )}
        {!auth && (
          <li
            className="relative flex"
          >
            <ActiveButton
              href="/api/auth/login"
              text={<>Login</>}
              icon={<LogInIcon />}
            />
          </li>
        )}

      </ul>
    </>
  );
};
