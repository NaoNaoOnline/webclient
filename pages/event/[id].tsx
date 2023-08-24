import "flowbite";
import React, { useEffect, useState, MouseEvent } from 'react';
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0/client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

import Event from '@/components/app/event/Event'
import Description from '@/components/app/description/Description'
import ErrorToast from '@/components/app/event/add/ErrorToast'

import { EventSearch } from '@/modules/api/event/search/Search'
import { EventSearchObject } from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

import CacheApiLabel from '@/modules/cache/api/Label';
import CacheAuthToken from '@/modules/cache/auth/Token';

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
            {!ldng && evnt && (
              <Event evnt={evnt} labl={cal} />
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
