import { MouseEvent, useState } from "react";

import Link from "next/link";

import { RiMenuAddLine } from "react-icons/ri";

import { useAuth } from "@/components/app/auth/AuthProvider";

import { EventLink } from "@/components/app/event/EventLink";

import { ListDialog } from "@/components/app/list/dialog/ListDialog";

import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import DescriptionSearchObject from "@/modules/api/description/search/Object";
import EventSearchObject from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

interface Props {
  evnt: EventSearchObject;
  desc: DescriptionSearchObject[];
  labl: LabelSearchResponse[];
}

export function EventHeader(props: Props) {
  const { auth } = useAuth();
  const { addInfo } = useToast();
  const [show, setShow] = useState<boolean>(false); // show list dialog

  return (
    <div className="relative flex flex-row w-full shadow-gray-400 dark:shadow-black shadow-[0px_1px_2px_-1px]">
      <div className="flex w-full overflow-hidden">
        {props.evnt.host(props.labl).map((x, i) => (
          <Link
            key={i}
            href={`/event?host=${encodeURIComponent(x.name)}`}
            className="ml-3 py-2 text-lg font-medium whitespace-nowrap text-gray-900 dark:text-gray-50 hover:underline"
          >
            @{x.name}
          </Link>
        ))}

        <Link
          href={"/event/" + props.evnt.evnt()}
          className="w-full"
        />
      </div>

      <div className="absolute right-0 flex bg-gray-50 dark:bg-gray-700 rounded-lg">

        <EventLink evnt={props.evnt} />

        <button
          onClick={(eve: MouseEvent<HTMLButtonElement>) => {
            if (!auth) {
              addInfo(new InfoPropsObject("Breh, you gotta login for that, mhh mhmhh!"));
            } else {
              setShow(true);
            }
          }}
          className="p-3 outline-none group"
          type="button"
        >
          <RiMenuAddLine className="w-5 h-5 text-gray-400 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-50" />
        </button>
      </div>

      <ListDialog
        clos={() => setShow(false)}
        desc={props.desc}
        evnt={props.evnt}
        labl={props.labl}
        show={show}
      />
    </div>
  );
};
