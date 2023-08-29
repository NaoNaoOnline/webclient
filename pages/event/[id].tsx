import "flowbite";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0/client';

import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'

import Event from '@/components/app/event/Event'
import ErrorToast from '@/components/app/event/add/ErrorToast'

import { EventSearch } from '@/modules/api/event/search/Search'
import { EventSearchObject } from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

import CacheApiLabel from '@/modules/cache/api/Label';
import CacheApiReaction from '@/modules/cache/api/Reaction';
import CacheAuthToken from '@/modules/cache/auth/Token';
import { DescriptionSearchResponse } from "@/modules/api/description/search/Response";
import { DescriptionSearch } from "@/modules/api/description/search/Search";
import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response';
import { UserSearch } from "@/modules/api/user/search/Search";
import { VoteSearch } from "@/modules/api/vote/search/Search";
import { VoteSearchResponse } from "@/modules/api/vote/search/Response";

import Errors from '@/modules/errors/Errors';

export default function Page() {
  const router = useRouter()
  const { user } = useUser();

  const [desc, setDesc] = useState<DescriptionSearchResponse[] | null>(null);
  const [evnt, setEvnt] = useState<EventSearchObject | null>(null);
  const [erro, setErro] = useState<Errors | null>(null);
  const [labl, setLabl] = useState<LabelSearchResponse[] | null>(null);
  const [ldng, setLdng] = useState<boolean>(true);
  const [rctn, setRctn] = useState<ReactionSearchResponse[] | null>(null);
  const [vote, setVote] = useState<VoteSearchResponse[] | null>(null);

  const cat: string = CacheAuthToken(user ? true : false);

  const cal: LabelSearchResponse[] = CacheApiLabel(user ? true : false, cat);
  if (user && cal && cal.length !== 0 && (!labl || labl.length === 0)) {
    setLabl(cal);
  }

  const car: ReactionSearchResponse[] = CacheApiReaction(user ? true : false, cat);
  if (user && car && car.length !== 0 && (!rctn || rctn.length === 0)) {
    setRctn(car);
  }

  useEffect(() => {
    if (evnt && desc) return;

    if (user && labl && rctn) {
      const fetchData = async function (): Promise<void> {
        try {
          const evn = await EventSearch([{ atkn: cat, evnt: router.query.id?.toString() || "" }]);
          const des = await DescriptionSearch([{ atkn: cat, evnt: router.query.id?.toString() || "" }]);
          const vot = await VoteSearch(des.map(x => ({ atkn: cat, desc: x.desc || "" })));
          const usr = await UserSearch(uniq(des).map(x => ({ atkn: cat, user: x || "" })));

          setEvnt(new EventSearchObject(evn[0]));
          setDesc(des.map(x => {
            const u = usr.find(y => y.user === x.user);
            if (u) {
              return {
                ...x,
                imag: u.imag,
                name: u.name,
              };
            } else {
              return x;
            }
          }));
          setVote(vot);

          setLdng(false);
        } catch (err) {
          setErro(new Errors("By Zeus' beard, the beavers built a dam and all the events got stuck!", err as Error));
          setLdng(false);
        }
      };

      fetchData();
    }
  }, [user, labl, rctn]);

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
            {!ldng && evnt && desc && labl && rctn && vote && (
              <Event atkn={cat} evnt={evnt} desc={desc} labl={labl} rctn={rctn} vote={vote} />
            )}
            {erro && (
              <ErrorToast erro={erro} />
            )}
          </div>
        </div>
      </div >
    </>
  );
};

function uniq(des: DescriptionSearchResponse[]): string[] {
  const lis: string[] = [];
  const set = new Set();

  des.forEach((x) => {
    if (!set.has(x.user)) {
      set.add(x.user);
      lis.push(x.user);
    }
  });

  return lis;
}

