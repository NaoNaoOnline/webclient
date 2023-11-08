import { useEffect, useState, MouseEvent } from "react";

import Link from "next/link";

import spacetime, { Spacetime } from "spacetime";

import EventSearchObject from "@/modules/api/event/search/Object";

function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

interface Props {
  evnt: EventSearchObject;
}

export function EventLink(props: Props) {
  const [_, setRndr] = useState(true);

  const now: Spacetime = spacetime.now();

  // Setup a periodic state change for updating the time based information in
  // the user interface every 5 seconds. Every time the setInterval callback is
  // executed the whole component re-renders using the updated clock time.
  useEffect(() => {
    const x = setInterval(() => {
      setRndr((old: boolean) => !old);
    }, 5 * 1000); // every 5 seconds

    return () => clearInterval(x);
  }, []);

  return (
    <Link
      href={props.evnt.link()}
      onClick={onLinkClick}
      target="_blank"
      className={`relative flex-1 py-2 mr-3 items-center whitespace-nowrap text-md font-medium hover:underline group ${props.evnt.actv(now) ? "text-green-400" : "text-gray-400"}`}
    >
      <div className="absolute top-[8%] right-[105%] ml-2 z-10 whitespace-nowrap invisible group-hover:visible p-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-gray-50 dark:text-gray-900">
        {props.evnt.upcm(now) && (
          <>
            {props.evnt.dsplUpcm(now)}
          </>
        )}
        {props.evnt.actv(now) && (
          <>
            {props.evnt.dsplActv(now)}
          </>
        )}
        {!props.evnt.upcm(now) && !props.evnt.actv(now) && (
          <>
            {dateTime(props.evnt.time(), now)}
            {` - `}
            {dateTime(props.evnt.dura(), now)}
          </>
        )}
      </div>
      {props.evnt.dsplLink(now)}
    </Link>
  );
};

function dateTime(tim: Spacetime, now: Spacetime): string {
  return tim.goto(now.timezone().name).format("{date-ordinal} {month-short}, {hour-24-pad}:{minute-pad}");
};
