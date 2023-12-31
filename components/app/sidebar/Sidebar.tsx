import { useEffect, useState } from "react";

import { BarsLeftIcon } from "@/components/app/icon/base/BarsLeftIcon";

import { ListButtons } from "@/components/app/sidebar/ListButtons";
import { SocialButtons } from "@/components/app/sidebar/SocialButtons";
import { UserButtons } from "@/components/app/sidebar/UserButtons";

export const Sidebar = () => {
  const [show, setShow] = useState<boolean>(true);

  const tglShow = () => {
    setShow((old: boolean) => !old);
  };

  useEffect(() => {
    const qry = window.matchMedia("(min-width: 1152px)"); // 6xl

    setShow(qry.matches);

    const onChange = (eve: MediaQueryListEvent) => {
      setShow(eve.matches);
    };

    qry.addEventListener("change", onChange);

    return () => {
      qry.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <div
      className={`
        fixed top-0 left-0 flex flex-row w-64 h-screen transition-transform 6xl:translate-x-0
        ${show ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div
        className="flex-none w-64 py-4 h-full bg-gray-200 dark:bg-gray-800 shadow-gray-400 dark:shadow-black shadow-[0_0_2px] overflow-y-auto"
      >

        <ListButtons />
        <UserButtons />
        <SocialButtons />

      </div>

      <div className="h-fit items-center mt-4 ml-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 group">
        <button
          className="p-2 outline-none"
          onClick={tglShow}
          type="button"
        >
          <BarsLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
        </button>
      </div>

    </div>
  );
};
