import { useEffect, useState, MouseEvent } from "react";

import Link from "next/link";

import spacetime, { Spacetime } from "spacetime";

import { useAuth } from "@/components/app/auth/AuthContext";

import EventSearchObject from "@/modules/api/event/search/Object";
import { EventUpdate } from "@/modules/api/event/update/Update";

interface Props {
  evnt: EventSearchObject;
}

export function EventLink(props: Props) {
  const { atkn, auth } = useAuth();

  const [_, setRndr] = useState(true);

  const now: Spacetime = spacetime.now();

  const updateClick = async (eve: MouseEvent<HTMLAnchorElement>) => {
    // We only want to track clicks on event links for authenticated users,
    // because those are users we can prevent counting twice.
    if (!auth) return;
    // We only want to track clicks on event links as long as the event has not
    // finished yet, because those are the clicks that effectively matter to
    // people.
    if (props.evnt.hpnd(now)) return;

    try {
      const [upd] = await EventUpdate([{ atkn: atkn, evnt: props.evnt.evnt(), link: "add" }]);
    } catch (err) {
      // Since we track event clicks silently, there are no toasts and no errors
      // to be reported. We can simply log in the developer console.
      console.error(err);
    }
  };

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
      onClick={updateClick}
      target="_blank"
      className={`relative py-2 items-center whitespace-nowrap text-lg font-medium hover:underline group ${props.evnt.actv(now) ? "text-green-400" : "text-gray-400"}`}
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
