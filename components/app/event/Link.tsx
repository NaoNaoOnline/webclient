import { useEffect, useState, MouseEvent } from 'react';

import EventSearchObject from "@/modules/api/event/search/Object";
import spacetime, { Spacetime } from 'spacetime';

function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

interface Props {
  evnt: EventSearchObject;
}

export default function Link(props: Props) {
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
    <a
      href={props.evnt.actv(now) ? props.evnt.link() : `/event/${props.evnt.evnt()}`}
      onClick={onLinkClick}
      target={props.evnt.actv(now) ? "_blank" : "_self"}
      className={`relative inline-block flex items-center p-2 whitespace-nowrap text-md font-medium hover:underline group ${props.evnt.actv(now) ? "text-green-400" : "text-gray-400"}`}
    >
      <div className="absolute top-[5%] right-[105%] ml-2 z-10 whitespace-nowrap invisible group-hover:visible px-3 py-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-gray-50 dark:text-gray-900">
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
            {dateTime(props.evnt.time())}
            {` - `}
            {dateTime(props.evnt.dura())}
          </>
        )}
      </div>
      {props.evnt.dsplLink(now)}
    </a>
  );
};

function dateTime(tim: Spacetime): string {
  return tim.format("{date-ordinal} {month-short}, {hour-24-pad}:{minute-pad}");
};
