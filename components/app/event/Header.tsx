import { MouseEvent } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function Event(props: Props) {
  const nxtrtr = useRouter();

  return (
    <div
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.metaKey || e.ctrlKey) {
          window.open("/event/" + props.evnt.evnt(), "_blank");
        } else {
          nxtrtr.push("/event/" + props.evnt.evnt());
        }
      }}
      className="relative rounded-t-md shadow-gray-400 dark:shadow-black shadow-[0_0_2px] overflow-hidden cursor-pointer"
    >
      <div className="flex flex-row px-1 w-full bg-white dark:bg-gray-700 items-center justify-between outline-none">
        <div className="flex w-full overflow-hidden">
          {props.evnt.host(props.labl).map((x, i) => (
            <Link
              key={i}
              href={`/event?host=${encodeURIComponent(x.name)}`}
              onClick={onLinkClick}
              className="flex items-center pl-2 py-2 text-lg font-medium whitespace-nowrap text-gray-900 dark:text-gray-50 hover:underline"
            >
              @{x.name}
            </Link>
          ))}
        </div>

        <div className="absolute right-0 flex pr-1 bg-white dark:bg-gray-700 ">
          <EventLink evnt={props.evnt} />
        </div>

      </div>
    </div>
  );
};
