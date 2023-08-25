import "flowbite";
import React, { useEffect, useState, MouseEvent } from 'react';
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0/client';

import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'

import Event from '@/components/app/event/Event'
import ErrorToast from '@/components/app/event/add/ErrorToast'

import { EventSearch } from '@/modules/api/event/search/Search'
import { EventSearchObject } from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

import CacheApiLabel from '@/modules/cache/api/Label';
import CacheAuthToken from '@/modules/cache/auth/Token';
import { DescriptionSearchResponse } from "@/modules/api/description/search/Response";
import { DescriptionSearch } from "@/modules/api/description/search/Search";

export default function Page() {
  const router = useRouter()
  const { user, isLoading } = useUser();

  const [desc, setDesc] = useState<DescriptionSearchResponse[] | null>(null);
  const [evnt, setEvnt] = useState<EventSearchObject | null>(null);
  const [labl, setLabl] = useState<LabelSearchResponse[] | null>(null);
  const [ldng, setLdng] = useState<boolean>(true);
  const [erro, setErro] = useState<Error | null>(null);

  const cat: string = CacheAuthToken(user ? true : false);
  const cal: LabelSearchResponse[] = CacheApiLabel(user ? true : false, cat);

  if (user && cal && cal.length !== 0 && (!labl || labl.length === 0)) {
    setLabl(cal);
  }

  useEffect(() => {
    if (evnt && desc) return;

    if (!isLoading && user && labl && cat) {
      const fetchData = async function (): Promise<void> {
        try {
          const [eve] = await EventSearch([{ atkn: cat, evnt: router.query.id?.toString() || "" }]);
          setEvnt(new EventSearchObject(eve));
          const des = await DescriptionSearch([{ atkn: cat, evnt: router.query.id?.toString() || "" }]);

          // TODO search for users and add user names and profiles pictures
          // dynamically.
          setDesc(des.map((description) => ({
            ...description,
            name: "xh3b4sd",
          })));

          setLdng(false);
        } catch (err) {
          setErro(err as Error);
          setLdng(false);
        }
      };

      fetchData();
    }
  }, [user, isLoading, labl]);

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
            {!ldng && evnt && desc && labl && (
              <Event atkn={cat} evnt={evnt} desc={desc} labl={labl} />
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
