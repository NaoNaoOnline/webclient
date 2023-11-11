import { MouseEvent, ReactNode } from "react";

import Link from "next/link";

import spacetime, { Spacetime } from "spacetime";

import { Tooltip } from "@/components/app/tooltip/Tooltip";

import EventSearchObject from "@/modules/api/event/search/Object";

interface Props {
  cupd: (eve: MouseEvent<HTMLAnchorElement>) => void;
  evnt: EventSearchObject;
  stat: number;
}

export function EventLink(props: Props) {
  return (
    <Tooltip
      desc={tipDesc(props.evnt, props.stat)}
      side="left"
    >
      <Link
        href={props.evnt.link()}
        onClick={props.cupd}
        target="_blank"
        className={`
          relative pl-2 py-2 items-center whitespace-nowrap text-lg
          hover:underline group
          ${props.stat === 0 ? "text-green-400 font-bold" : "text-gray-400 dark:text-gray-400 font-medium"}
        `}
      >

        {props.evnt.dsplLink(spacetime.now())}

      </Link>
    </Tooltip>
  );
};

const tipDesc = (eve: EventSearchObject, sta: number): ReactNode => {
  if (sta === -1) return disUpcm(eve, spacetime.now());
  if (sta === 0) return disActv(eve, spacetime.now());
  if (sta === +1) return disHpnd(eve, spacetime.now());

  return disHpnd(eve, spacetime.now());
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
