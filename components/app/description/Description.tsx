import React, { useState, MouseEvent } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import RatingBar from '@/components/app/rating/RatingBar'
import RatingPicker from '@/components/app/rating/RatingPicker'

import CacheApiRating from '@/modules/cache/api/Rating';
import CacheAuthToken from '@/modules/cache/auth/Token';

import { RatingSearchResponse } from '@/modules/api/rating/search/Response';
import { EventSearchObject } from "@/modules/api/event/search/Object";
import { DescriptionSearchResponse } from '@/modules/api/description/search/Response';

function onLinkClick(evn: MouseEvent<HTMLAnchorElement>) {
  evn.stopPropagation();
}

interface Props {
  evnt: EventSearchObject;
  desc: DescriptionSearchResponse;
}

export default function Description(props: Props) {
  const { user, isLoading } = useUser();
  const [rtng, setList] = useState<RatingSearchResponse[]>([]); // TODO init with description reactions

  const atk: string = CacheAuthToken(user ? true : false);
  const cro: RatingSearchResponse[] = CacheApiRating(user ? true : false, atk);

  const onBttnClick = (amnt: number, name: string) => {
    // Remove the reaction that the user clicked again if it now has a zero
    // count. The cleaned up list is injected into the rating components and the
    // list of valid reactions is rendered again.
    if (amnt === 0) {
      setList(rtng.filter((x) => x.name !== name));
    }
  };

  const onPckrClick = (x: RatingSearchResponse) => {
    const ind = rtng.findIndex((y) => y.name === x.name);

    if (ind !== -1) {
      if (!x.clck && !rtng[ind].clck) {
        rtng[ind].amnt += 1;
        rtng[ind].clck = true;
      }
    } else {
      x.amnt = 1;
      x.clck = true;
      rtng.push(x);
    }

    setList([...rtng]);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 first:border-none border-t-solid border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between">
        <div className="flex-shrink-0 flex flex-row">
          <a
            href={`/user/${props.desc.name}`}
            onClick={onLinkClick}
            className="flex items-center pl-2"
          >
            <img className="w-7 h-7 rounded-full" src={props.desc.imag} alt="profile picture"></img>
          </a>
          <a
            href={`/user/${props.desc.name}`}
            onClick={onLinkClick}
            className="flex items-center pl-2 py-3 text-gray-900 dark:text-gray-50 text-sm font-medium whitespace-nowrap hover:underline"
          >
            {props.desc.name}
          </a>
          {props.desc.user === props.evnt.user() && (
            <label className="relative inline-block flex items-center bg-blue-100 mx-2 my-3 px-[3px] font-medium text-blue-600 text-xs rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-500 cursor-pointer group">
              EC
              <div className="absolute top-[-50%] left-[105%] ml-2 z-10 whitespace-nowrap invisible group-hover:visible px-3 py-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900">
                Event Creator
              </div>
            </label>
          )}
        </div>

        <div className="flex-grow relative overflow-x-auto">
          <RatingBar hndl={onBttnClick} rtng={rtng} />
        </div>

        <div>
          <RatingPicker ratings={cro} onClick={onPckrClick} columns={6} />
        </div>
      </div>

      <p className="px-2 pb-2 text-sm text-gray-900 dark:text-gray-50">
        {props.desc.text}
      </p>
    </div>
  );
};
