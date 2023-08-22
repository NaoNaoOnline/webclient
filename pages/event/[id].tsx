import "flowbite";
import React, { useEffect, useState, MouseEvent } from 'react';
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0/client';

import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { UserIcon } from '@heroicons/react/24/outline'

import Description from '@/components/app/event/Description'
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
  const router = useRouter()
  const { user, isLoading } = useUser();

  const [evnt, setEvnt] = useState<EventSearchObject | null>(null);
  const [ldng, setLdng] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [erro, setErro] = useState<Error | null>(null);

  const cat: string = CacheAuthToken(user ? true : false);
  const cal: LabelSearchResponse[] = CacheApiLabel(user ? true : false, cat);

  useEffect(() => {
    if (!isLoading && user && cat && cal) {
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
  }, [user, isLoading, cat, cal]);

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
                <h3 className="text-3xl text-gray-900 dark:text-white">Event</h3>
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
                  className="relative rounded-t-md shadow-gray-400 shadow-[0_0_2px] overflow-hidden cursor-pointer"
                >
                  <div className="flex flex-1 w-full items-center justify-between bg-white outline-none">
                    <div className="flex flex-row w-full">
                      {cal && (
                        evnt?.host(cal).map((x, i) => (
                          <a key={i} href={`/host/${x}`} onClick={onLinkClick} className="flex items-center p-2 text-lg font-medium whitespace-nowrap text-gray-900 hover:underline">
                            {x}
                          </a>
                        ))
                      )}
                    </div>

                    <a href={`/event/${router.query.id}`} onClick={onLinkClick} className="flex items-center p-2 whitespace-nowrap text-md font-medium text-green-400 hover:underline">
                      join now now
                    </a>
                    <button
                      onClick={(eve: MouseEvent<HTMLButtonElement>) => {
                        eve.stopPropagation();
                        setOpen(!open);
                      }}
                      className="py-3 cursor-pointer text-gray-400 hover:text-gray-900"
                    >
                      <ChevronDownIcon className={`w-5 h-5 mx-2 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>

                {!open && (
                  <ul className="shadow-gray-400 shadow-[0_0_2px]">
                    <Description />
                  </ul>
                )}

                {open && (
                  <ul className="shadow-gray-400 shadow-[0_0_2px]">
                    <Description />
                    <Description />
                    <Description />
                  </ul>
                )}

                <div
                  onClick={() => window.location.href = "/event/" + router.query.id}
                  className="flex flex-1 rounded-b-md cursor-default items-center justify-between bg-white shadow-gray-400 shadow-[0_0_2px] outline-none cursor-pointer"
                >
                  <div className="flex flex-row w-full">

                    {cal && (
                      evnt?.cate(cal).map((x, i) => (
                        <a href={`/cate/${x}`} onClick={onLinkClick} className="flex items-center p-2 text-sm font-medium text-sky-500 hover:underline">
                          #{x}
                        </a>
                      ))
                    )}

                  </div>

                  <button onClick={onBttnClick} className="py-3 text-gray-400 hover:text-gray-900 cursor-pointer">
                    <EllipsisHorizontalIcon className="w-5 h-5 mx-2" />
                  </button>
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
