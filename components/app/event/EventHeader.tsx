import { MouseEvent } from "react";

import Link from "next/link";

import { EventLink } from "@/components/app/event/EventLink";

import DescriptionSearchObject from "@/modules/api/description/search/Object";
import EventSearchObject from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

interface Props {
  evnt: EventSearchObject;
  desc: DescriptionSearchObject[];
  labl: LabelSearchResponse[];
}

export function EventHeader(props: Props) {
  return (
    <div className="relative flex flex-row w-full shadow-gray-400 dark:shadow-black shadow-[0px_1px_2px_-1px]">
      {props.evnt.host(props.labl).map((x, i) => (
        <Link
          key={i}
          href={`/event?host=${encodeURIComponent(x.name)}`}
          className="flex-1 ml-3 py-2 text-lg font-medium whitespace-nowrap text-gray-900 dark:text-gray-50 hover:underline"
        >
          @{x.name}
        </Link>
      ))}

      <Link
        href={"/event/" + props.evnt.evnt()}
        className="w-full"
      />

      <EventLink evnt={props.evnt} />

    </div>
  );
};
