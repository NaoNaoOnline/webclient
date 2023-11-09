import { MouseEvent, ReactNode, useEffect, useState } from "react";

import Link from "next/link";

import spacetime, { Spacetime } from "spacetime";

import { useAuth } from "@/components/app/auth/AuthProvider";

import { Tooltip } from "@/components/app/tooltip/Tooltip";

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
    <Tooltip
      desc={tipDesc(props.evnt, now)}
      side="left"
    >
      <Link
        href={props.evnt.link()}
        onClick={updateClick}
        target="_blank"
        className={`relative pl-2 py-2 items-center whitespace-nowrap text-lg font-medium hover:underline group ${props.evnt.actv(now) ? "text-green-400" : "text-gray-400"}`}
      >

        {props.evnt.dsplLink(now)}

      </Link>
    </Tooltip>
  );
};

const tipDesc = (eve: EventSearchObject, now: Spacetime): ReactNode => {
  if (eve.upcm(now)) return disUpcm(eve, now);
  if (eve.actv(now)) return disActv(eve, now);

  return disHpnd(eve, now);
}

const disActv = (eve: EventSearchObject, now: Spacetime): ReactNode => {
  return (
    <div>
      <div className="relative flex">
        <span>
          start&nbsp;
        </span>
        <span className="ml-auto">
          {eve.time().diff(now, "minute")}
        </span>
        <span>
          m ago&nbsp;
        </span>
      </div>
      <div className="relative flex">
        <span>
          still&nbsp;
        </span>
        <span className="ml-auto">
          {now.startOf("minute").diff(eve.dura(), "minute")}
        </span>
        <span>
          m left
        </span>
      </div>
    </div>
  );
}

const disHpnd = (eve: EventSearchObject, now: Spacetime): ReactNode => {
  return (
    <div>
      <div className="relative flex">
        <span>
          start&nbsp;
        </span>
        <span className="ml-auto">
          {datTime(eve.time(), now)}
        </span>
      </div>
      <div className="relative flex">
        <span>
          until&nbsp;
        </span>
        <span className="ml-auto">
          {datTime(eve.dura(), now)}
        </span>
      </div>
    </div>
  );
};

const disUpcm = (eve: EventSearchObject, now: Spacetime): ReactNode => {
  return `in ${now.startOf("minute").diff(eve.time(), "minute")}m`;
};

const datTime = (tim: Spacetime, now: Spacetime): string => {
  return tim.goto(now.timezone().name).format("{date-ordinal} {month-short}, {hour-24-pad}:{minute-pad}");
};
