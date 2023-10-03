import { useState, MouseEvent } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

import spacetime, { Spacetime } from "spacetime";

import ReactionBar from "@/components/app/reaction/ReactionBar";
import Form from "@/components/app/description/update/Form";
import DescriptionMenu from "@/components/app/description/DescriptionMenu";

import InfoToast from "@/components/app/toast/InfoToast";

import { DescriptionSearchResponse } from "@/modules/api/description/search/Response";
import EventSearchObject from "@/modules/api/event/search/Object";
import { ReactionSearchResponse } from "@/modules/api/reaction/search/Response";

function onLinkClick(evn: MouseEvent<HTMLAnchorElement>) {
  evn.stopPropagation();
}

interface Props {
  atkn: string;
  drem: (des: DescriptionSearchResponse) => void;
  desc: DescriptionSearchResponse;
  evnt: EventSearchObject;
  radd: (des: DescriptionSearchResponse, rct: ReactionSearchResponse) => void;
  rctn: ReactionSearchResponse[];
  rrem: (des: DescriptionSearchResponse, rct: ReactionSearchResponse) => void;
}

export default function Description(props: Props) {
  const { user } = useUser();

  const [equl, setEqul] = useState<boolean[]>([]);
  const [form, setForm] = useState<boolean>(false);
  const [text, setText] = useState<string>(props.desc.text);

  const now: Spacetime = spacetime.now();

  const ownr: boolean = props.desc.user === user?.intern?.uuid; // current user is description owner
  const told: boolean = !now.isBefore(crtd(props.desc.crtd).add(5, "minute")); // description is too old
  const hpnd: boolean = props.evnt.hpnd(now); // event already happened

  return (
    <div className="bg-gray-50 dark:bg-gray-800 first:border-none border-t-solid border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between">
        <div className="flex-shrink-0 flex flex-row">
          <a
            href={`/event?user=${props.desc.name}`}
            onClick={onLinkClick}
            className="flex items-center pl-2"
          >
            <Image
              alt="profile picture"
              className="w-7 h-7 rounded-full"
              height={28}
              width={28}
              src={props.desc.imag}
            />
          </a>
          <a
            href={`/event?user=${props.desc.name}`}
            onClick={onLinkClick}
            className="flex items-center pl-2 py-3 text-gray-900 dark:text-gray-50 text-sm font-medium whitespace-nowrap hover:underline"
          >
            {props.desc.name}
          </a>
          {props.desc.user === props.evnt.user() && (
            <span className="relative inline-block flex items-center rounded mx-2 my-3 px-[3px] text-xs font-medium bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400 border border-sky-500 cursor-pointer group">
              EC
              <div className="absolute top-[-50%] left-[105%] ml-2 z-10 whitespace-nowrap invisible group-hover:visible p-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-gray-50 dark:text-gray-900">
                Event Creator
              </div>
            </span>
          )}
        </div>

        <div className="flex-grow relative overflow-x-auto">
          <ReactionBar
            updt={!props.evnt.hpnd(now)}
            radd={(rctn: ReactionSearchResponse) => props.radd(props.desc, rctn)}
            rrem={(rctn: ReactionSearchResponse) => props.rrem(props.desc, rctn)}
            rctn={props.rctn}
          />
        </div>

        <div>
          <DescriptionMenu
            clmn={6}
            cdel={ownr && !told && !hpnd}
            cupd={ownr && !told && !hpnd}
            desd={() => props.drem(props.desc)}
            desu={() => setForm((old: boolean) => !old)}
            radd={(rctn: ReactionSearchResponse) => props.radd(props.desc, rctn)}
            rctn={props.rctn}
          />
        </div>
      </div>

      {form && (
        <Form
          atkn={props.atkn}
          cncl={() => setForm(false)}
          desc={props.desc.desc}
          done={(txt: string) => {
            if (txt === text) {
              setEqul((old: boolean[]) => [...old, true]);
            } else {
              setText(txt);
            }
          }}
          text={text}
        />
      )}
      {!form && (
        <p className="px-2 pb-2 text-sm text-gray-900 dark:text-gray-50">
          {text}
        </p>
      )}
      {equl.map((x, i) => (
        <InfoToast
          key={i}
          desc="Nothing to change here, don't worry mate. No biggie at all!"
        />
      ))}
    </div>
  );
};

const crtd = (uni: string): Spacetime => {
  return spacetime(Number(uni) * 1000).goto("GMT");
}
