import React, { useState, MouseEvent } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import RatingBar from '@/components/app/rating/RatingBar'
import RatingPicker from '@/components/app/rating/RatingPicker'

import { UserIcon } from '@heroicons/react/24/outline'

import CacheApiRating from '@/modules/cache/api/Rating';
import CacheAuthToken from '@/modules/cache/auth/Token';

import { RatingSearchResponse } from '@/modules/api/rating/search/Response';

function onLinkClick(x: MouseEvent<HTMLAnchorElement>) {
  x.stopPropagation();
}

export default function Description() {
  const { user, isLoading } = useUser();
  const [list, setList] = useState<RatingSearchResponse[]>([]); // TODO init with description reactions

  const atk: string = CacheAuthToken(user ? true : false);
  const cro: RatingSearchResponse[] = CacheApiRating(user ? true : false, atk);

  const onBttnClick = (amnt: number, name: string) => {
    // Remove the reaction that the user clicked again if it now has a zero
    // count. The cleaned up list is injected into the rating components and the
    // list of valid reactions is rendered again.
    if (amnt === 0) {
      setList(list.filter((x) => x.name !== name));
    }
  };

  const onPckrClick = (x: RatingSearchResponse) => {
    const ind = list.findIndex((y) => y.name === x.name);

    if (ind !== -1) {
      if (!x.clck && !list[ind].clck) {
        list[ind].amnt += 1;
        list[ind].clck = true;
      }
    } else {
      x.amnt = 1;
      x.clck = true;
      list.push(x);
    }

    setList([...list]);
  };

  return (
    <div className="border-t-solid border-t border-gray-200">

      <div className="flex justify-between">

        <div className="flex-shrink-0 flex flex-row">
          <a href="/user/xh3b4sd" onClick={onLinkClick} className="flex items-center p-2 dark:text-white">
            <UserIcon className="w-7 h-7 p-1 text-white bg-blue-600 rounded-full transition duration-75" />
          </a>
          <a href="/user/xh3b4sd" onClick={onLinkClick} className="flex items-center px-2 py-3 text-gray-900">
            <span className="text-sm font-medium whitespace-nowrap hover:underline">xh3b4sd</span>
          </a>
        </div>

        <div className="flex-grow relative overflow-x-auto">
          <RatingBar hndl={onBttnClick} list={list} />
        </div>

        <div>
          <RatingPicker ratings={cro} onClick={onPckrClick} columns={6} />
        </div>
      </div>

      <p className="px-2 pb-2 text-sm text-gray-900">
        This is a good event description with enough space for text. And maybe
        even more.
      </p>
    </div>
  );
};
