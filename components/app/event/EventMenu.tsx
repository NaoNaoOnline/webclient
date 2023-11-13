import { MouseEvent } from "react";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

function onItemClick(e: MouseEvent<HTMLDivElement>) {
  e.stopPropagation();
}

interface Props {
  cadd: boolean;    // can add description
  crem: boolean;    // can remove event
  dadd: () => void; // description add callback
  erem: () => void; // event remove callback
}

export const EventMenu = (props: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex-1 py-3 pr-3 outline-none group"
          type="button"
        >
          <EllipsisHorizontalIcon className="w-5 h-5 text-gray-400 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          onClick={onItemClick}
          className="min-w-[220px] bg-gray-50 dark:bg-gray-700 rounded-md p-[5px] shadow-gray-400 dark:shadow-black shadow-[0_0_2px] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          loop
        >

          <DropdownMenu.Item
            disabled={!props.cadd}
            onSelect={props.dadd}
            className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-gray-50 cursor-pointer"
          >
            Add Description
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-[1px] bg-gray-200 dark:bg-gray-800 my-[5px]" />

          <DropdownMenu.Item
            disabled={!props.crem}
            onSelect={props.erem}
            className="text-red-600 dark:text-red-600 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-red-600 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-red-600 cursor-pointer"
          >
            Delete Event
          </DropdownMenu.Item>

        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
