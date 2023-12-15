import Link from "next/link";

import * as Checkbox from "@radix-ui/react-checkbox";

import { CheckLineIcon } from "@/components/app/icon/base/CheckLineIcon";
import { OpenInNewIcon } from "@/components/app/icon/base/OpenInNewIcon";

interface Props {
  chck: (che: boolean | "indeterminate") => void; // Radix onCheckedChange callback
  dflt: boolean;                                  // is default checked
  user: string;                                   // user name of the creator to show
}

export const CreatorSelect = (props: Props) => {
  return (
    <div
      className="flex flex-row group"
    >
      <label
        className="inline-flex w-full h-[32px] p-2 leading-none rounded-md text-gray-900 dark:text-gray-50 items-center select-none outline-none hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 cursor-pointer"
        htmlFor={props.user}
      >
        <Checkbox.Root
          id={props.user}
          defaultChecked={props.dflt}
          onCheckedChange={props.chck}
          className="flex-none w-4 h-4 bg-gray-700 mr-2 dark:bg-gray-50 items-center justify-center rounded-sm outline-none"
        >
          <Checkbox.Indicator>
            <CheckLineIcon className="text-gray-50 dark:text-gray-900" />
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span className="text-sm truncate max-w-[120px] sm:max-w-[155px]">
          @{props.user}
        </span>

      </label>

      <Link
        href={"/user/" + encodeURIComponent(props.user)}
        target="_blank"
        className={`
          flex ml-2
          items-center select-none outline-none
          text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50
          hover:underline hover:underline-offset-2
          invisible group-hover:visible
        `}
      >
        <OpenInNewIcon className="w-5 h-5" />
      </Link>
    </div>
  );
};
