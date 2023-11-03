import { useState, MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import spacetime, { Spacetime } from "spacetime";

import EventMenu from "@/components/app/event/EventMenu";

import ListDialog from "@/components/app/list/ListDialog";

import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastContext";

import DescriptionSearchObject from "@/modules/api/description/search/Object";
import { EventDelete } from "@/modules/api/event/delete/Delete";
import EventSearchObject from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

interface Props {
  atkn: string;
  dadd: () => void;
  desc: DescriptionSearchObject[];
  erem: (eve: EventSearchObject) => void;
  evnt: EventSearchObject;
  labl: LabelSearchResponse[];
}

export default function Footer(props: Props) {
  const patnam = usePathname();
  const nxtrtr = useRouter();

  const { addErro, addPgrs, addScss } = useToast();
  const { user } = useUser();

  const [show, setShow] = useState<boolean>(false); // show list dialog

  const now: Spacetime = spacetime.now();

  const dmax: boolean = props.desc.length >= 50; // description limit per event
  const ownr: boolean = props.evnt.ownr(user);   // current user is event owner
  const hpnd: boolean = props.evnt.hpnd(now);    // event already happened

  const pgrs: ProgressPropsObject = new ProgressPropsObject("Removing Event");
  const scss: SuccessPropsObject = new SuccessPropsObject("You are crushing it bb, that event's gone for good!");

  const eventDelete = async function (eve: EventSearchObject) {
    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [del] = await EventDelete([{ atkn: props.atkn, evnt: eve.evnt() }]);

      pgrs.setDone(() => {
        props.erem(eve);
        if (indPag(patnam)) nxtrtr.push("/");
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      addErro(new ErrorPropsObject("The beavers are sick of it, no more carpin' all them diems!", err as Error));
    }
  };

  return (
    <div
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.metaKey || e.ctrlKey) {
          window.open("/event/" + props.evnt.evnt(), '_blank');
        } else {
          nxtrtr.push("/event/" + props.evnt.evnt());
        }
      }}
      className="flex flex-1 mb-4 rounded-b-md dark:bg-gray-700 items-center justify-between bg-white shadow-gray-400 dark:shadow-black shadow-[0_0_2px] outline-none cursor-pointer"
    >
      <div className="flex flex-row w-full">
        {props.labl && (
          props.evnt?.cate(props.labl).map((x, i) => (
            <a
              key={i}
              href={`/event?cate=${encodeURIComponent(x)}`}
              onClick={onLinkClick}
              className="flex items-center pl-2 py-2 text-sm font-medium whitespace-nowrap text-sky-500 hover:underline"
            >
              #{x}
            </a>
          ))
        )}
      </div>

      <EventMenu
        cadd={!dmax && !hpnd}
        crem={ownr && !hpnd}
        dadd={props.dadd}
        erem={() => eventDelete(props.evnt)}
        slis={() => setShow(true)}
      />

      <ListDialog
        atkn={props.atkn}
        clos={() => setShow(false)}
        show={show}
      />
    </div>
  );
};

// indPag expressed whether the URL path of the current page complies with the
// URL format of the event page as shown below.
//
//     /event/1698943315449571
//
const indPag = function (str: string): boolean {
  const spl = str.split('/');

  if (spl.length >= 2 && spl[spl.length - 2] === "event") {
    return !isNaN(Number(spl[spl.length - 1]))
  }

  return false;
}
