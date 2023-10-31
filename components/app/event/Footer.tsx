import { useState, MouseEvent } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

import spacetime, { Spacetime } from "spacetime";

import EventMenu from "@/components/app/event/EventMenu";

import ErrorToast from "@/components/app/toast/ErrorToast";
import ProgressToast from "@/components/app/toast/ProgressToast";
import SuccessToast from "@/components/app/toast/SuccessToast";

import DescriptionSearchObject from "@/modules/api/description/search/Object";
import EventSearchObject from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

import Errors from "@/modules/errors/Errors";
import { EventDelete } from "@/modules/api/event/delete/Delete";

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
  const { user } = useUser();

  const [cmpl, setCmpl] = useState<number>(0);
  const [cncl, setCncl] = useState<boolean>(false);
  const [dltd, setDltd] = useState<EventSearchObject | null>(null);
  const [erro, setErro] = useState<Errors[]>([]);
  const [sbmt, setSbmt] = useState<boolean[]>([]);

  const now: Spacetime = spacetime.now();

  const dmax: boolean = props.desc.length >= 50; // description limit per event
  const ownr: boolean = props.evnt.ownr(user);   // current user is event owner
  const hpnd: boolean = props.evnt.hpnd(now);    // event already happened

  const eventDelete = async function (eve: EventSearchObject) {
    setCmpl(10);
    setCncl(false);
    setSbmt((old: boolean[]) => [...old, true]);

    try {
      setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [del] = await EventDelete([{ atkn: props.atkn, evnt: eve.evnt() }]);

      setCmpl(100);
      await new Promise(r => setTimeout(r, 200));

      setDltd(eve);

    } catch (err) {
      setCmpl(0);
      setCncl(true);
      setErro((old: Errors[]) => [...old, new Errors("The beavers are sick of it, no more carpin' all them diems!", err as Error)]);
    }
  };

  return (
    <div
      onClick={(e: MouseEvent<HTMLDivElement>) => {
        if (e.metaKey || e.ctrlKey) {
          window.open("/event/" + props.evnt.evnt(), '_blank');
        } else {
          window.location.href = "/event/" + props.evnt.evnt();
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
      />

      {sbmt.map((x, i) => (
        <ProgressToast
          key={i}
          cmpl={cmpl}
          cncl={cncl}
          desc="Removing Event"
          done={() => {
            if (dltd) {
              props.erem(dltd);
              setDltd(null);
            }
          }}
        />
      ))}

      {erro.map((x, i) => (
        <ErrorToast
          key={i}
          erro={x}
        />
      ))}

      {cmpl >= 100 && (
        <SuccessToast
          desc="You are crushing it bb, that event's gone for good!"
        />
      )}
    </div>
  );
};
