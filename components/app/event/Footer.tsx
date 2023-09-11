import { MouseEvent } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import spacetime from "spacetime"

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline"

import EventSearchObject from "@/modules/api/event/search/Object"
import { LabelSearchResponse } from "@/modules/api/label/search/Response"

function onItemClick(e: MouseEvent<HTMLDivElement>) {
  e.stopPropagation();
}

function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

interface Props {
  addd: () => void;
  evnt: EventSearchObject;
  labl: LabelSearchResponse[];
}

export default function Footer(props: Props) {
  return (
    <div
      onClick={() => window.location.href = "/event/" + props.evnt.evnt()}
      className="flex flex-1 mb-4 rounded-b-md dark:bg-gray-700 items-center justify-between bg-white shadow-gray-400 dark:shadow-black shadow-[0_0_2px] outline-none cursor-pointer"
    >
      <div className="flex flex-row w-full">
        {props.labl && (
          props.evnt?.cate(props.labl).map((x, i) => (
            <a key={i} href={`/cate/${x}`} onClick={onLinkClick} className="flex items-center pl-2 py-2 text-sm font-medium text-sky-500 hover:underline">
              #{x}
            </a>
          ))
        )}
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="py-3 outline-none group" type="button">
            <EllipsisHorizontalIcon className="w-5 h-5 mx-2 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            onClick={onItemClick}
            className="min-w-[220px] bg-gray-50 dark:bg-gray-700 rounded-md p-[5px] shadow-gray-400 dark:shadow-black shadow-[0_0_2px] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
            loop
          >

            <DropdownMenu.Item
              disabled={props.evnt.hpnd(spacetime.now())}
              onSelect={props.addd}
              className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-gray-50 cursor-pointer"
            >
              Add Description
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-[1px] bg-gray-200 dark:bg-gray-800 my-[5px]" />

            <DropdownMenu.Item
              className="text-red-600 dark:text-red-600 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-red-600 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-red-600 cursor-pointer"
            >
              Delete Event
            </DropdownMenu.Item>

          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};
