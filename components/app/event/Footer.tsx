import { MouseEvent, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import spacetime, { Spacetime } from "spacetime";

import { RiMenuAddLine } from "react-icons/ri";

import EventMenu from "@/components/app/event/EventMenu";

import ListDialog from "@/components/app/list/ListDialog";

import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastContext";

import { useAuth } from "@/components/app/auth/AuthContext";

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
  indx: boolean;
  labl: LabelSearchResponse[];
}

export default function Footer(props: Props) {
  const nxtrtr = useRouter();
  const { auth, atkn } = useAuth();

  const { addErro, addInfo, addPgrs, addScss } = useToast();
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

      const [del] = await EventDelete([{ atkn: atkn, evnt: eve.evnt() }]);

      pgrs.setDone(() => {
        props.erem(eve);
        // If an event gets deleted from the event page, there is nothing on the
        // event page anymore after the event itself got removed. In that case
        // we redirect to whatever default view is active for the user.
        if (props.indx) nxtrtr.push("/");
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      addErro(new ErrorPropsObject("The beavers are sick of it, no more carpin' all them diems!", err as Error));
    }
  };

  return (
    <>
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
            <Link
              key={i}
              href={`/event?cate=${encodeURIComponent(x.name)}`}
              onClick={onLinkClick}
              className="flex items-center pl-2 py-2 text-sm font-medium whitespace-nowrap text-sky-500 hover:underline"
            >
              #{x.name}
            </Link>
          ))}
        </div>

        <button
          onClick={(eve: MouseEvent<HTMLButtonElement>) => {
            eve.stopPropagation();
            if (!auth) {
              addInfo(new InfoPropsObject("Breh, you gotta login for that, mhh mhmhh!"));
            } else {
              setShow(true);
            }
          }}
          className="p-3 outline-none group"
          type="button"
        >
          <RiMenuAddLine className="w-5 h-4 text-gray-400 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-50 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300" />
        </button>

        <EventMenu
          cadd={!dmax && !hpnd}
          crem={ownr && !hpnd}
          dadd={props.dadd}
          erem={() => eventDelete(props.evnt)}
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
