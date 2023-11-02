import { KeyboardEvent, MouseEvent } from "react";

import * as Dialog from "@radix-ui/react-dialog";

import { XMarkIcon } from "@heroicons/react/24/outline";
import ListSearch from "./ListSearch";

function onItemClick(e: MouseEvent<HTMLDivElement>) {
  e.stopPropagation();
}

interface Props {
  clos: () => void; // close dialog callback
  show: boolean;    // show dialog
}

export default function ListDialog(props: Props) {
  return (
    <Dialog.Root
      open={props.show}
      onOpenChange={(ope: boolean) => {
        if (!ope) props.clos();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-900/25 fixed inset-0" />
        <Dialog.Content
          onClick={onItemClick}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 shadow-gray-400 dark:shadow-black shadow-[0_0_2px] fixed top-[50%] left-[50%] min-h-[400px] max-w-xl translate-x-[-50%] translate-y-[-50%] focus:outline-none"
        >
          <Dialog.Title className="text-gray-900 dark:text-gray-50 text-md font-medium mb-6">
            Manage Lists
          </Dialog.Title>

          <div className="grid gap-x-4 grid-cols-10">
            <div className="relative w-full max-h-[340px] px-2 mb-6 col-span-5 overflow-y-auto">
              kwfejhf wekj web kjwhebcwjkckjwe ckwej cwejnc kwec ewk
              ckewjncjkwehbc jehwbc kwfejhf wekj web kjwhebcwjkckjwe ckwej
              cwejnc kwec ewk ckewjncjkwehbc jehwbc kwfejhf wekj web
              kjwhebcwjkckjwe ckwej cwejnc kwec ewk ckewjncjkwehbc jehwbc
              kwfejhf wekj web kjwhebcwjkckjwe ckwej cwejnc kwec ewk
              ckewjncjkwehbc jehwbc kwfejhf wekj web kjwhebcwjkckjwe ckwej
              cwejnc kwec ewk ckewjncjkwehbc jehwbc kwfejhf wekj web
              kjwhebcwjkckjwe ckwej cwejnc kwec ewk ckewjncjkwehbc jehwbc
              kwfejhf wekj web kjwhebcwjkckjwe ckwej cwejnc kwec ewk
              ckewjncjkwehbc jehwbc kwfejhf wekj web kjwhebcwjkckjwe ckwej
              cwejnc kwec ewk ckewjncjkwehbc jehwbc kwfejhf wekj web
              kjwhebcwjkckjwe ckwej cwejnc kwec ewk ckewjncjkwehbc jehwbc
            </div>

            <div className="absolute w-[1px] top-[13%] right-[50%] h-[70%] bg-gray-300 dark:bg-gray-600"></div>

            <div className="relative w-full max-h-[340px] px-2 mb-6 col-span-5">
              <ListSearch
                clis={(lis: string) => console.log("create", lis)}
                list={[
                  { list: "1", name: "one" },
                  { list: "2", name: "two" },
                  { list: "3", name: "three" },
                  { list: "4", name: "four" },
                  { list: "5", name: "five" },
                ]}
                slct={(lis) => console.log("selected", lis)}
              />
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              className="flex-1 w-full px-5 py-2.5 text-gray-50 bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm text-center"
              onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
            >
              Save
            </button>
          </Dialog.Close>

          <Dialog.Close asChild>
            <button
              className="py-3 outline-none group"
              type="button"
              aria-label="Close"
            >
              <XMarkIcon className="absolute top-4 right-4 w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
            </button>
          </Dialog.Close>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >
  );
};
