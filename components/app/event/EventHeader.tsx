import { MouseEvent } from "react";

import Link from "next/link";

import { EventLink } from "@/components/app/event/EventLink";

import EventSearchObject from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

interface Props {
  cupd: (eve: MouseEvent<HTMLAnchorElement>) => void;
  evnt: EventSearchObject;
  labl: LabelSearchResponse[];
  stat: number;
}

export function EventHeader(props: Props) {
  return (
    <div className="relative flex flex-row w-full shadow-gray-400 dark:shadow-black shadow-[0px_1px_2px_-1px]">
      <div className="flex w-full overflow-hidden">
        {props.evnt.host(props.labl).map((x, i) => (
          <Link
            key={i}
            href={`/event/label/host/${encodeURIComponent(x.name)}`}
            className={`
              ml-3 py-2
              text-gray-900 dark:text-gray-50 font-medium text-lg whitespace-nowrap
              hover:underline hover:underline-offset-2
            `}
          >
            @{x.name}
          </Link>
        ))}

        <Link
          href={"/event/" + props.evnt.evnt()}
          className="w-full"
        />
      </div>

      <div className="absolute right-3 flex bg-gray-50 dark:bg-gray-700 rounded-lg">
        <EventLink
          cupd={props.cupd}
          evnt={props.evnt}
          stat={props.stat}
        />
      </div>
    </div>
  );
};
