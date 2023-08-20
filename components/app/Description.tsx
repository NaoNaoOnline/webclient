import React, { MouseEvent } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import RatingPicker from '@/components/app/RatingPicker'

import { UserIcon } from '@heroicons/react/24/outline'

import CacheApiRating from '@/modules/cache/api/Rating';
import CacheAuthToken from '@/modules/cache/auth/Token';

import { RatingSearchResponse } from '@/modules/api/rating/search/Response';

function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

export default function Description() {
  const { user, isLoading } = useUser();

  const atk: string = CacheAuthToken(user ? true : false);
  const cro: RatingSearchResponse[] = CacheApiRating(user ? true : false, atk);

  return (
    <div className="border-t-solid border-t border-gray-200">
      <ul className="flex flex-row w-full">
        <li className="flex-none items-center">
          <a href="/user/xh3b4sd" onClick={onLinkClick} className="flex items-center p-2 dark:text-white">
            <UserIcon className="flex-shrink-0 w-7 h-7 p-1 text-white bg-blue-600 rounded-full transition duration-75" />
          </a>
        </li>
        <li className="flex-none items-center">
          <a href="/user/xh3b4sd" onClick={onLinkClick} className="flex items-center px-2 py-3 text-gray-900">
            <span className="flex-1 text-sm font-medium whitespace-nowrap hover:underline">xh3b4sd</span>
          </a>
        </li>
        <li className="flex-1 relative items-center">
          <RatingPicker ratings={cro} onClick={(name: string) => console.log(name)} columns={6} />
        </li>
      </ul>

      <p className="px-2 pb-2 text-sm text-gray-900">
        This is a good event description with enough space for text. And maybe
        even more.
      </p>
    </div>
  );
};
