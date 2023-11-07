import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";

interface Props {
  incl: boolean;
  slct: (val: string) => void; // Radix onValueChange callback
}

export function DialogTitle(props: Props) {
  return (
    <Dialog.Title className="mb-4 text-gray-900 dark:text-gray-50 text-md font-medium">
      Manage Lists to

      <Select.Root
        defaultValue="incl"
        onValueChange={props.slct}
      >
        <Select.Trigger
          className="inline-flex px-1 data-[placeholder]:text-gray-900 data-[placeholder]:dark:text-gray-50 underline items-center justify-center outline-none"
        >

          <Select.Value placeholder={props.incl ? "include" : "exclude"} />

        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="bg-gray-50 dark:bg-gray-700 rounded-md shadow-gray-400 dark:shadow-black shadow-[0_0_2px]">
            <Select.Viewport className="p-[5px]">
              <Select.Item
                className="flex text-md p-2 leading-none rounded-md text-gray-900 dark:text-gray-50 items-center select-none outline-none hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 data-[state=checked]:underline cursor-pointer"
                value="incl"
              >
                <Select.ItemText>
                  include
                </Select.ItemText>
              </Select.Item>

              <Select.Item
                className="flex text-md p-2 leading-none rounded-md text-gray-900 dark:text-gray-50 items-center select-none outline-none hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 data-[state=checked]:underline cursor-pointer"
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
    </Dialog.Title>
  );
}
