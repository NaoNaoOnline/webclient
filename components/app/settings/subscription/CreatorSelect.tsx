import * as Checkbox from "@radix-ui/react-checkbox";

import { MdOutlineOpenInNew } from "react-icons/md";
import { RiCheckLine } from "react-icons/ri";

interface Props {
  chck: (che: boolean | "indeterminate") => void; // Radix onCheckedChange callback
  name: string;                                   // user name of the creator to show
}

export const CreatorSelect = (props: Props) => {
  return (
    <div
      className="flex flex-row group"
    >
      <label
        className="inline-flex w-full h-[32px] p-2 leading-none rounded-md text-gray-900 dark:text-gray-50 items-center select-none outline-none hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 cursor-pointer"
        htmlFor={props.name}
      >
        <Checkbox.Root
          id={props.name}
          onCheckedChange={props.chck}
          className="flex-none w-4 h-4 bg-gray-700 mr-2 dark:bg-gray-50 items-center justify-center rounded-sm outline-none"
        >
          <Checkbox.Indicator>
            <RiCheckLine className="text-gray-50 dark:text-gray-900" />
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span className="text-sm truncate max-w-[120px] sm:max-w-[155px]">
          @{props.name}
        </span>

        <span className="inline-block items-center rounded ml-2 my-3 px-[3px] text-xs font-medium bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400 border border-sky-500 cursor-pointer group">
          <MdOutlineOpenInNew />
        </span>

      </label>
    </div>
  );
};
