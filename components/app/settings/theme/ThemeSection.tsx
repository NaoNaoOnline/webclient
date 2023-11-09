import { useEffect, useState } from "react";
import * as Switch from "@radix-ui/react-switch";

import { Half2Icon } from "@radix-ui/react-icons";

import { useSystem } from "@/components/app/theme/SystemThemeProvider";

export default function ThemeSection() {
  const [rndr, setRndr] = useState<boolean>(false);
  const [syst, setSyst] = useSystem();

  useEffect(() => {
    setRndr(true);
  }, []);

  return (
    <>
      {!rndr && (
        <></>
      )}
      {rndr && (
        <ul className="flex flex-row relative w-full pt-4 mt-4 border-t border-gray-300 dark:border-gray-800">
          <li className="flex items-center p-3 rounded-lg text-gray-900 dark:text-gray-50">
            <Half2Icon className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="flex-1 ml-3 whitespace-nowrap">System Theme</span>
          </li>

          <li className="flex p-3 absolute right-0 items-center">
            <Switch.Root
              className="w-[39px] h-[22px] rounded-full relative shadow-[0_0_0_2px] shadow-gray-900 dark:shadow-gray-50 data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-gray-50 outline-none"
              checked={syst}
              onCheckedChange={setSyst}
            >
              <Switch.Thumb className="block w-[18px] h-[18px] bg-gray-900 dark:bg-gray-50 data-[state=checked]:bg-gray-50 dark:data-[state=checked]:bg-gray-900 rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
            </Switch.Root>
          </li>
        </ul>
      )}
    </>
  );
};
