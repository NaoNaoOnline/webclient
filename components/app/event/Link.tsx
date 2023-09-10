import { useEffect, useState, MouseEvent } from 'react';

import { EventSearchObject } from "@/modules/api/event/search/Object";

function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

interface Props {
  evnt: EventSearchObject;
}

export default function Link(props: Props) {
  const [_, setRndr] = useState(true);

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
      href={props.evnt.actv() ? props.evnt.link() : `/event/${props.evnt.evnt()}`}
      onClick={onLinkClick}
      target={props.evnt.actv() ? "_blank" : "_self"}
      className={`relative inline-block flex items-center p-2 whitespace-nowrap text-md font-medium hover:underline group ${props.evnt.actv() ? "text-green-400" : "text-gray-400"}`}
    >
      <div className="absolute top-[5%] right-[105%] ml-2 z-10 whitespace-nowrap invisible group-hover:visible px-3 py-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-gray-50 dark:text-gray-900">
        {props.evnt.actv() && (
          <>
            {rltvActv(props.evnt.time())}
            {` - `}
            {rltvActv(props.evnt.dura())}
          </>
        )}
        {!props.evnt.actv() && (
          <>
            {props.evnt.upcm() && (
              <>
                {rltvUpcm(props.evnt.time())}
              </>
            )}
            {!props.evnt.upcm() && (
              <>
                {dateTime(props.evnt.time())}
                {` - `}
                {dateTime(props.evnt.dura())}
              </>
            )}
          </>
        )}
      </div>
      {linkText(props.evnt.time(), props.evnt.dura())}
    </a>
  );
};

function dateTime(uni: number): string {
  const dat = new Date(uni * 1000);

  const day = String(dat.getDate()).padStart(2, '0');
  const mon = String(dat.getMonth() + 1).padStart(2, '0');
  const yea = String(dat.getFullYear()).slice(-2);
  const hou = String(dat.getHours()).padStart(2, '0');
  const min = String(dat.getMinutes()).padStart(2, '0');

  return `${day}.${mon}.${yea} ${hou}:${min}`;
};

function rltvActv(uni: number): string {
  const now = Math.floor(Date.now() / 1000);
  const dif = uni - now;

  if (dif < 0) {
    return `${Math.abs(Math.floor(dif / 60)) - 1}m ago`;
  } else {
    return `${Math.ceil(dif / 60)}m left`;
  }
};

function rltvUpcm(uni: number): string {
  const now = Math.floor(Date.now() / 1000);
  const dif = uni - now;

  return `in ${Math.ceil(dif / 60)}m`;
};

function linkText(tim: number, dur: number): string {
  const zon = (new Date().getTimezoneOffset() * 60)

  tim -= zon;
  dur -= zon;

  const min = 60;
  const hou = 60 * min;
  const day = 24 * hou;
  const wee = 7 * day;
  const mon = 30 * day;

  const now = Math.floor(Date.now() / 1000) - zon;
  const dif = tim - now;
  const eod = Math.floor(now / day) * day + day;

  if (dif <= tim - dur) {
    return "already happened";
  } else if (dif <= 0) {
    return "join now now";
  } else if (dif <= hou) {
    return "coming up next";
  } else if (dif <= eod - now) {
    return "later today";
  } else if (dif <= 2 * day) {
    return "tomorrow";
  } else if (dif <= wee) {
    return "next week";
  } else if (dif <= mon) {
    return "next month";
  } else {
    return "in the future";
  }
}
