import { MouseEvent } from 'react';

import ReactionBar from '@/components/app/reaction/ReactionBar'
import Menu from '@/components/app/description/Menu'

import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response';
import { EventSearchObject } from "@/modules/api/event/search/Object";
import { DescriptionSearchResponse } from '@/modules/api/description/search/Response';

function onLinkClick(evn: MouseEvent<HTMLAnchorElement>) {
  evn.stopPropagation();
}

interface Props {
  radd: (des: DescriptionSearchResponse, rct: ReactionSearchResponse) => void;
  rrem: (des: DescriptionSearchResponse, rct: ReactionSearchResponse) => void;
  desc: DescriptionSearchResponse;
  evnt: EventSearchObject;
  rctn: ReactionSearchResponse[];
}

export default function Description(props: Props) {
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
            <label className="relative inline-block flex items-center rounded mx-2 my-3 px-[3px] text-xs font-medium bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400 border border-sky-500 cursor-pointer group">
              EC
              <div className="absolute top-[-50%] left-[105%] ml-2 z-10 whitespace-nowrap invisible group-hover:visible px-3 py-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900">
                Event Creator
              </div>
            </label>
          )}
        </div>

        <div className="flex-grow relative overflow-x-auto">
          <ReactionBar
            radd={(rctn: ReactionSearchResponse) => props.radd(props.desc, rctn)}
            rrem={(rctn: ReactionSearchResponse) => props.rrem(props.desc, rctn)}
            rctn={props.rctn}
          />
        </div>

        <div>
          <Menu
            rctn={props.rctn}
            clmn={6}
            radd={(rctn: ReactionSearchResponse) => props.radd(props.desc, rctn)}
          />
        </div>
      </div>

      <p className="px-2 pb-2 text-sm text-gray-900 dark:text-gray-50">
        {props.desc.text}
      </p>
    </div>
  );
};
