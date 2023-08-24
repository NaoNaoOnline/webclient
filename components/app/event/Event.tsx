import "flowbite";
import React, { useEffect, useState, MouseEvent } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { UserIcon } from '@heroicons/react/24/outline'

import Description from '@/components/app/description/Description'

import { EventSearchObject } from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

interface Props {
  evnt: EventSearchObject;
  labl: LabelSearchResponse[];
}

export default function Event(props: Props) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={() => window.location.href = "/event/" + props.evnt.evnt}
        className="relative rounded-t-md shadow-gray-400 dark:shadow-black shadow-[0_0_2px] overflow-hidden cursor-pointer"
      >
        <div className="flex flex-row w-full dark:bg-gray-700 items-center justify-between bg-white outline-none">
          <a
            href="/user/xh3b4sd"
            onClick={onLinkClick}
            className="flex items-center pl-2"
          >
            <UserIcon className="w-7 h-7 p-1 text-gray-50 bg-blue-600 rounded-full" />
          </a>

          <div className="flex flex-row w-full">
            {props.labl && (
              props.evnt?.host(props.labl).map((x, i) => (
                <a key={i} href={`/host/${x}`} onClick={onLinkClick} className="flex items-center pl-2 py-2 text-lg font-medium whitespace-nowrap text-gray-900 dark:text-gray-50 hover:underline">
                  {x}
                </a>
              ))
            )}
          </div>

          <a href={`/event/${props.evnt.evnt}`} onClick={onLinkClick} className="flex items-center p-2 whitespace-nowrap text-md font-medium text-green-400 hover:underline">
            join now now
          </a>
          <button
            className="py-3 outline-none group"
            type="button"
            onClick={(eve: MouseEvent<HTMLButtonElement>) => {
              eve.stopPropagation();
              setOpen(!open);
            }}
          >
            <ChevronDownIcon className={`w-5 h-5 mx-2 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {!open && (
        <div className="shadow-gray-400 dark:shadow-black shadow-[0_0_2px]">
          <Description />
        </div>
      )}

      {open && (
        <div className="shadow-gray-400 dark:shadow-black shadow-[0_0_2px]">
          <Description />
          <Description />
          <Description />
        </div>
      )}

      <div
        onClick={() => window.location.href = "/event/" + props.evnt.evnt}
        className="flex flex-1 rounded-b-md dark:bg-gray-700 items-center justify-between bg-white shadow-gray-400 dark:shadow-black shadow-[0_0_2px] outline-none cursor-pointer"
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
              <EllipsisHorizontalIcon className="w-5 h-5 mx-2 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[220px] bg-gray-50 dark:bg-gray-700 rounded-md p-[5px] shadow-gray-400 dark:shadow-black shadow-[0_0_2px] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
              loop
            >

              <DropdownMenu.Item className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-white cursor-pointer">
                Add Description
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-[1px] bg-gray-200 dark:bg-gray-800 my-[5px]" />

              <DropdownMenu.Item disabled className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-white cursor-pointer">
                Update Event
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-white cursor-pointer">
                Report Event
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-red-600 dark:text-red-600 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-red-600 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-red-600 cursor-pointer">
                Delete Event
              </DropdownMenu.Item>

            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </>
  );
};
