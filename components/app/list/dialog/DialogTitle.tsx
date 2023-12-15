import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";

import { InfoCircleIcon } from "@/components/app/icon/base/InfoCircleIcon";

import { Tooltip } from "@/components/app/tooltip/Tooltip";

interface Props {
  incl: boolean;
  slct: (val: string) => void; // Radix onValueChange callback
}

export function DialogTitle(props: Props) {
  return (
    <Dialog.Title className="flex flex-row mb-4 text-gray-900 dark:text-gray-50 text-md font-medium">
      Manage Lists to

      <Select.Root
        defaultValue="incl"
        onValueChange={props.slct}
      >
        <Select.Trigger
          className="inline-flex px-1 data-[placeholder]:text-gray-900 data-[placeholder]:dark:text-gray-50 underline underline-offset-2 decoration-dashed items-center justify-center outline-none"
        >

          <Select.Value placeholder={props.incl ? "include" : "exclude"} />

        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="bg-gray-50 dark:bg-gray-700 rounded-md shadow-gray-400 dark:shadow-black shadow-[0_0_2px]"
          >
            <Select.Viewport className="p-[5px]">
              <Select.Item
                className="flex text-md p-2 leading-none rounded-md text-gray-900 dark:text-gray-50 items-center select-none outline-none hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 data-[state=checked]:underline data-[state=checked]:underline-offset-2 data-[state=checked]:decoration-dashed cursor-pointer"
                value="incl"
              >
                <Select.ItemText>
                  include
                </Select.ItemText>
              </Select.Item>

              <Select.Item
                className="flex text-md p-2 leading-none rounded-md text-gray-900 dark:text-gray-50 items-center select-none outline-none hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 data-[state=checked]:underline data-[state=checked]:underline-offset-2 data-[state=checked]:decoration-dashed cursor-pointer"
                value="excl"
              >
                <Select.ItemText>
                  exclude
                </Select.ItemText>
              </Select.Item>
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      Events

      <span
        className="flex-1 ml-1 my-auto"
      >
        <Tooltip
          desc={
            <div>
              <div>use <b>include</b> to follow events</div>
              <div>use <b>exclude</b> to ignore events</div>
            </div>
          }
          side="right"
        >
          <InfoCircleIcon
            className="w-5 h-5 text-gray-500 dark:text-gray-500"
          />
        </Tooltip>
      </span>
    </Dialog.Title>
  );
}
