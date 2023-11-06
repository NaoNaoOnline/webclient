import "flowbite";

import { ListButtons } from "@/components/app/sidebar/ListButtons";
import { SocialButtons } from "@/components/app/sidebar/SocialButtons";
import { UserButtons } from "@/components/app/sidebar/UserButtons";

export function Sidebar() {
  return (
    <aside
      id="default-sidebar"
      className="fixed top-0 left-0 z-50 w-64 h-screen transition-transform -translate-x-full md:translate-x-0"
      aria-label="Sidebar"
      aria-hidden
    >
      <div className="h-full px-4 py-4 shadow-gray-400 dark:shadow-black shadow-[0_0_2px] overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ListButtons />
        <UserButtons />
        <SocialButtons />
      </div>
    </aside>
  );
};
