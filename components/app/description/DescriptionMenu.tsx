import { useState } from "react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

import { DeleteButton } from "@/components/app/button/DeleteButton";

interface Props {
  crem: boolean;    // can remove description
  cupd: boolean;    // can update description
  drem: () => void; // description remove callback
  dupd: () => void; // description update callback
}

export const DescriptionMenu = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="py-3 outline-none group" type="button">
            <EllipsisHorizontalIcon className="w-5 h-5 mr-2 text-gray-400 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[220px] bg-gray-50 dark:bg-gray-700 rounded-md p-[5px] shadow-gray-400 dark:shadow-black shadow-[0_0_2px] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
            loop
          >

            <DropdownMenu.Item
              disabled={!props.cupd}
              className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-gray-50 cursor-pointer"
              onSelect={() => props.dupd()}
            >
              Update Description
            </DropdownMenu.Item>
            <DropdownMenu.Item
              disabled={!props.crem}
              className="text-red-600 dark:text-red-600 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-red-600 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-red-600 cursor-pointer"
              onSelect={() => setOpen(true)}
            >
              Delete Description
            </DropdownMenu.Item>

          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <DeleteButton
        actn={props.drem}
        clse={() => setOpen(false)}
        desc="This cannot be undone. We'll smash it the fuck to bits."
        open={open}
        titl="Delete Description"
      />
    </>
  );
};
