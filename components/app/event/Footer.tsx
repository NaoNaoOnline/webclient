import { useState, MouseEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import spacetime, { Spacetime } from "spacetime";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

import EventMenu from "@/components/app/event/EventMenu";

import ListDialog from "@/components/app/list/ListDialog";

import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastContext";

import { useToken } from "@/components/app/token/TokenContext";

import DescriptionSearchObject from "@/modules/api/description/search/Object";
import { EventDelete } from "@/modules/api/event/delete/Delete";
import EventSearchObject from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

interface Props {
  dadd: () => void;
  desc: DescriptionSearchObject[];
  erem: (eve: EventSearchObject) => void;
  evnt: EventSearchObject;
  labl: LabelSearchResponse[];
  xpnd: () => void;
}

export default function Footer(props: Props) {
  const patnam = usePathname();
  const nxtrtr = useRouter();
  const { auth, atkn } = useToken();

  const { addErro, addInfo, addPgrs, addScss } = useToast();
  const { user } = useUser();

  const [show, setShow] = useState<boolean>(false); // show list dialog
  const [xpnd, setXpnd] = useState<boolean>(false);


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

      const [del] = await EventDelete([{ atkn: atkn, evnt: eve.evnt() }]);

      pgrs.setDone(() => {
        props.erem(eve);
        // If an event gets deleted from the event page, there is nothing on the
        // event page anymore after the event itself got removed. In that case
        // we redirect to whatever default view is active for the user.
        if (indPag(patnam)) nxtrtr.push("/");
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      addErro(new ErrorPropsObject("The beavers are sick of it, no more carpin' all them diems!", err as Error));
    }
  };

  return (
    <>
      {props.desc.length > 1 && (
        <div className="relative w-full h-0 z-10 grid justify-items-center">
          <button
            className={`absolute top-[-10px] bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-500 hover:border-gray-400 hover:dark:border-gray-400 outline-none group`}
            type="button"
            onClick={(evn: MouseEvent<HTMLButtonElement>) => {
              evn.stopPropagation();
              props.xpnd();
              setXpnd(!xpnd);
            }}
          >
            <ChevronDownIcon className={`w-5 h-4 mt-[1px] mx-2 text-gray-400 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-50 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 ${xpnd ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}

      <div
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          if (e.metaKey || e.ctrlKey) {
            window.open("/event/" + props.evnt.evnt(), '_blank');
          } else {
            nxtrtr.push("/event/" + props.evnt.evnt());
          }
        }}
        className="flex flex-1 mb-4 px-1 rounded-b-md dark:bg-gray-700 items-center justify-between bg-white shadow-gray-400 dark:shadow-black shadow-[0_0_2px] outline-none cursor-pointer"
      >
        <div className="flex flex-row w-full">
          {props.evnt.cate(props.labl).map((x, i) => (
            <a
              key={i}
              href={`/event?cate=${encodeURIComponent(x.name)}`}
              onClick={onLinkClick}
              className="flex items-center pl-2 py-2 text-sm font-medium whitespace-nowrap text-sky-500 hover:underline"
            >
              #{x.name}
            </a>
          ))}
        </div>

        <EventMenu
          cadd={!dmax && !hpnd}
          crem={ownr && !hpnd}
          dadd={props.dadd}
          erem={() => eventDelete(props.evnt)}
          slis={() => {
            if (!auth) {
              addInfo(new InfoPropsObject("Breh, you gotta login for that, mhh mhmhh!"));
            } else {
              setShow(true);
            }
          }}
        />

        <ListDialog
          clos={() => setShow(false)}
          desc={props.desc}
          evnt={props.evnt}
          labl={props.labl}
          show={show}
        />
      </div >
    </>
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
