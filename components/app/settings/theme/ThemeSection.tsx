import * as Switch from "@radix-ui/react-switch";

import { MdContrast } from "react-icons/md";

import { ListHeader } from "@/components/app/layout/ListHeader";
import { useSystem } from "@/components/app/theme/SystemThemeProvider";

export const ThemeSection = () => {
  const [syst, setSyst] = useSystem();

  return (
    <ListHeader
      icon={<MdContrast />}
      titl="System Theme"
      bttn={
        <Switch.Root
          className="w-[39px] h-[22px] rounded-full relative shadow-[0_0_0_2px] shadow-gray-900 dark:shadow-gray-50 data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-gray-50 outline-none"
          checked={syst}
          onCheckedChange={setSyst}
        >
          <Switch.Thumb className="block w-[18px] h-[18px] bg-gray-900 dark:bg-gray-50 data-[state=checked]:bg-gray-50 dark:data-[state=checked]:bg-gray-900 rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </Switch.Root>
      }
    />
  );
};
