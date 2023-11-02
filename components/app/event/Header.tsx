import { useState, MouseEvent } from "react";
import { useRouter } from "next/navigation";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

import Link from "@/components/app/event/Link";

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
  xpnd: () => void;
}

export default function Event(props: Props) {
  const nxtrtr = useRouter();

  const [xpnd, setXpnd] = useState<boolean>(false);

  return (
    <div
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.metaKey || e.ctrlKey) {
          window.open("/event/" + props.evnt.evnt(), '_blank');
        } else {
          nxtrtr.push("/event/" + props.evnt.evnt());
        }
      }}
      className="relative rounded-t-md shadow-gray-400 dark:shadow-black shadow-[0_0_2px] overflow-hidden cursor-pointer"
    >
      <div className="flex flex-row w-full dark:bg-gray-700 items-center justify-between bg-white outline-none">
        <div className="flex flex-row w-full">
          {props.labl && (
            props.evnt?.host(props.labl).map((x, i) => (
              <a
                key={i}
                href={`/event?host=${encodeURIComponent(x)}`}
                onClick={onLinkClick}
                className="flex items-center pl-2 py-2 text-lg font-medium whitespace-nowrap text-gray-900 dark:text-gray-50 hover:underline"
              >
                @{x}
              </a>
            ))
          )}
        </div>

        <Link evnt={props.evnt} />

        <button
          className={`py-3 outline-none group ${props.desc.length > 1 ? "" : "cursor-default"}`}
          type="button"
          onClick={(evn: MouseEvent<HTMLButtonElement>) => {
            evn.stopPropagation();
            if (props.desc.length > 1) {
              props.xpnd();
              setXpnd(!xpnd);
            }
          }}
        >
          <ChevronDownIcon className={`w-5 h-5 mx-2 ${props.desc.length > 1 ? "text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300" : "text-gray-200 dark:text-gray-600 cursor-default"}  ${xpnd ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );
};
