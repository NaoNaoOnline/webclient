import { useState, MouseEvent } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

import spacetime, { Spacetime } from "spacetime";

import ReactionBar from "@/components/app/reaction/ReactionBar";
import Form from "@/components/app/description/update/Form";
import DescriptionMenu from "@/components/app/description/DescriptionMenu";

import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastContext";

import DescriptionSearchObject from "@/modules/api/description/search/Object";
import EventSearchObject from "@/modules/api/event/search/Object";

function onLinkClick(evn: MouseEvent<HTMLAnchorElement>) {
  evn.stopPropagation();
}

interface Props {
  amnt: number;
  atkn: string;
  drem: (des: DescriptionSearchObject) => void;
  desc: DescriptionSearchObject;
  evnt: EventSearchObject;
  radd: (des: DescriptionSearchObject, use: boolean) => void;
  rrem: (des: DescriptionSearchObject, use: boolean) => void;
}

export default function Description(props: Props) {
  const { addInfo } = useToast();
  const { user } = useUser();

  const [form, setForm] = useState<boolean>(false);
  const [text, setText] = useState<string>(props.desc.text());

  const now: Spacetime = spacetime.now();

  const only: boolean = props.amnt == 1;       // the event has only one description
  const ownr: boolean = props.desc.ownr(user); // current user is description owner
  const told: boolean = props.desc.cupd(now);  // description is too old
  const hpnd: boolean = props.evnt.hpnd(now);  // event already happened

  return (
    <div className="bg-gray-50 dark:bg-gray-800 first:border-none border-t-solid border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between">
        <div className="flex-shrink-0 flex flex-row">
          <a
            href={`/event?user=${encodeURIComponent(props.desc.name())}`}
            onClick={onLinkClick}
            className="flex items-center pl-2"
          >
            <Image
              alt="profile picture"
              className="w-7 h-7 rounded-full"
              height={28}
              width={28}
              src={props.desc.imag()}
            />
          </a>
          <a
            href={`/event?user=${encodeURIComponent(props.desc.name())}`}
            onClick={onLinkClick}
            className="flex items-center pl-2 py-3 text-gray-900 dark:text-gray-50 text-sm font-medium whitespace-nowrap hover:underline"
          >
            {props.desc.name()}
          </a>
          {props.desc.user() === props.evnt.user() && (
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
            amnt={props.desc.likeAmnt()}
            cupd={!props.evnt.hpnd(now)}
            radd={(use: boolean) => props.radd(props.desc, use)}
            rrem={(use: boolean) => props.rrem(props.desc, use)}
            user={props.desc.likeUser()}
          />
        </div>

        <div>
          <DescriptionMenu
            cdel={ownr && !told && !hpnd && !only}
            cupd={ownr && !told && !hpnd}
            desd={() => props.drem(props.desc)}
            desu={() => setForm((old: boolean) => !old)}
          />
        </div>
      </div>

      {form && (
        <Form
          atkn={props.atkn}
          cncl={() => setForm(false)}
          desc={props.desc.desc()}
          done={(txt: string) => {
            if (txt === text) {
              addInfo(new InfoPropsObject("Nothing to change here, don't worry mate. No biggie at all!"));
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
    </div>
  );
};
