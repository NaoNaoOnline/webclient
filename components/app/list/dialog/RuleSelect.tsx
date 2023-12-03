import * as Checkbox from "@radix-ui/react-checkbox";

import { RiCheckLine } from "react-icons/ri";
import { RiFileCopyLine } from "react-icons/ri";

import { CopyButton } from "@/components/app/button/CopyButton";

interface Props {
  chck: (che: boolean | "indeterminate") => void; // Radix onCheckedChange callback
  crtr?: boolean;                                 // is event creator
  name: string;                                   // resource name, e.g. host or like
  prfx?: string;                                  // label text prefix, e.g. @ or # for hosts and categories
  rsrc: string;                                   // resource ID, e.g. Label.labl or User.user
  salt: string;
  text: string;                                   // label text to show for the rendered resource
}

export const RuleSelect = (props: Props) => {
  return (
    <div
      className="flex flex-row group"
    >
      <label
        className="inline-flex w-full h-[32px] p-2 leading-none rounded-md text-gray-900 dark:text-gray-50 items-center select-none outline-none hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 cursor-pointer"
        htmlFor={props.name + ":" + props.rsrc}
      >
        <Checkbox.Root
          id={props.name + ":" + props.rsrc}
          onCheckedChange={props.chck}
          className="flex-none w-4 h-4 bg-gray-700 mr-2 dark:bg-gray-50 items-center justify-center rounded-sm outline-none"
        >
          <Checkbox.Indicator>
            <RiCheckLine className="text-gray-50 dark:text-gray-900" />
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span className="text-sm truncate max-w-[120px] sm:max-w-[155px]">
          {props.prfx}{props.text}
        </span>
        {props.crtr && (
          <span className="inline-block items-center rounded ml-2 my-3 px-[3px] text-xs font-medium bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400 border border-sky-500 cursor-pointer group">
            EC
          </span>
        )}
      </label>

      <CopyButton
        className="rounded-md ml-2 text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 items-center select-none outline-none invisible group-hover:visible"
        copy={props.text}
        icon={<RiFileCopyLine className="w-5 h-5" />}
      />
    </div>
  );
};
