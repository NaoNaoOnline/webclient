import "flowbite";
import React, { useEffect, useState, MouseEvent } from 'react';
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0/client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

import Description from '@/components/app/description/Description'
import ErrorToast from '@/components/app/event/add/ErrorToast'

import { EventSearch } from '@/modules/api/event/search/Search'
import { EventSearchObject } from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

import CacheApiLabel from '@/modules/cache/api/Label';
import CacheAuthToken from '@/modules/cache/auth/Token';

function onBttnClick(e: MouseEvent<HTMLButtonElement>) {
  e.stopPropagation();
}

function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

export default function Page() {
  console.log("render")
  const router = useRouter()
  const { user, isLoading } = useUser();

  const [evnt, setEvnt] = useState<EventSearchObject | null>(null);
  const [ldng, setLdng] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [erro, setErro] = useState<Error | null>(null);

  const cat: string = CacheAuthToken(user ? true : false);
  const cal: LabelSearchResponse[] = CacheApiLabel(user ? true : false, cat);

  console.log("cat", cat)
  console.log("cal", cal)

  useEffect(() => {
    if (evnt) return;

    console.log("useEffect")
    if (!isLoading && user && cal && cat) {
      console.log("fetchData")
      const fetchData = async function (): Promise<void> {
        try {
          const [res] = await EventSearch([{ atkn: cat, evnt: router.query.id?.toString() || "" }]);
          setEvnt(new EventSearchObject(res));
          setLdng(false);
        } catch (err) {
          setErro(err as Error);
          setLdng(false);
        }
      };

      fetchData();
    }
  }, [user, isLoading, cal]);

  return (
    <>
      <div className="pl-4 pr-4 mt-4 md:ml-64">
        <div className="pl-4 pr-4 flex grid justify-items-center">
          <div className="rounded-lg w-full max-w-xl">

            <ul className="flex flex-row w-full">
              <li className="flex items-center md:hidden mr-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 group">
                <button className="p-2" data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button">
                  <Bars3BottomLeftIcon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </button>
              </li>
              <li className="w-full">
                <h3 className="text-3xl text-gray-900 dark:text-gray-50">Event</h3>
              </li>
            </ul>

          </div>
        </div>
      </div >

      <div className="pl-4 pr-4 mt-4 md:ml-64">
        <div className="pl-4 pr-4 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-white">
            {ldng && (
              <></>
            )}
            {!ldng && (
              <>
                <div
                  onClick={() => window.location.href = "/event/" + router.query.id}
                  className="relative rounded-t-md shadow-gray-400 dark:shadow-black shadow-[0_0_2px] overflow-hidden cursor-pointer"
                >
                  <div className="flex flex-1 w-full dark:bg-gray-700 items-center justify-between bg-white outline-none">
                    <div className="flex flex-row w-full">
                      {cal && (
                        evnt?.host(cal).map((x, i) => (
                          <a key={i} href={`/host/${x}`} onClick={onLinkClick} className="flex items-center p-2 text-lg font-medium whitespace-nowrap text-gray-900 dark:text-gray-50 hover:underline">
                            {x}
                          </a>
                        ))
                      )}
                    </div>

                    <a href={`/event/${router.query.id}`} onClick={onLinkClick} className="flex items-center p-2 whitespace-nowrap text-md font-medium text-green-400 hover:underline">
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
                  onClick={() => window.location.href = "/event/" + router.query.id}
                  className="flex flex-1 rounded-b-md dark:bg-gray-700 items-center justify-between bg-white shadow-gray-400 dark:shadow-black shadow-[0_0_2px] outline-none cursor-pointer"
                >
                  <div className="flex flex-row w-full">

                    {cal && (
                      evnt?.cate(cal).map((x, i) => (
                        <a key={i} href={`/cate/${x}`} onClick={onLinkClick} className="flex items-center p-2 text-sm font-medium text-sky-500 hover:underline">
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
                        <DropdownMenu.Item className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-white cursor-pointer">
                          Update Description
                        </DropdownMenu.Item>

                        <DropdownMenu.Separator className="h-[1px] bg-gray-200 m-[5px]" />

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
            )}
            {erro && (
              <ErrorToast error={erro} />
            )}
          </div>
        </div>
      </div >
    </>
  );
};
