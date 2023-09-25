import { useState, MouseEvent } from "react"
import Image from "next/image"

import ReactionBar from "@/components/app/reaction/ReactionBar"
import Form from "@/components/app/description/update/Form"
import Menu from "@/components/app/description/Menu"

import InfoToast from "@/components/app/toast/InfoToast"

import { ReactionSearchResponse } from "@/modules/api/reaction/search/Response"
import EventSearchObject from "@/modules/api/event/search/Object"
import { DescriptionSearchResponse } from "@/modules/api/description/search/Response"

function onLinkClick(evn: MouseEvent<HTMLAnchorElement>) {
  evn.stopPropagation();
}

interface Props {
  atkn: string;
  radd: (des: DescriptionSearchResponse, rct: ReactionSearchResponse) => void;
  rrem: (des: DescriptionSearchResponse, rct: ReactionSearchResponse) => void;
  desc: DescriptionSearchResponse;
  evnt: EventSearchObject;
  rctn: ReactionSearchResponse[];
}

export default function Description(props: Props) {
  const [equl, setEqul] = useState<boolean[]>([]);
  const [form, setForm] = useState<boolean>(false);
  const [text, setText] = useState<string>(props.desc.text);

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
            <label className="relative inline-block flex items-center rounded mx-2 my-3 px-[3px] text-xs font-medium bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400 border border-sky-500 cursor-pointer group">
              EC
              <div className="absolute top-[-50%] left-[105%] ml-2 z-10 whitespace-nowrap invisible group-hover:visible p-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-gray-50 dark:text-gray-900">
                Event Creator
              </div>
            </label>
          )}
        </div>

        <div className="flex-grow relative overflow-x-auto">
          <ReactionBar
            radd={(rctn: ReactionSearchResponse) => props.radd(props.desc, rctn)}
            rrem={(rctn: ReactionSearchResponse) => props.rrem(props.desc, rctn)}
            rctn={props.rctn}
          />
        </div>

        <div>
          <Menu
            clmn={6}
            delt={props.desc.user !== props.evnt.user()}
            desu={() => setForm((old: boolean) => !old)}
            radd={(rctn: ReactionSearchResponse) => props.radd(props.desc, rctn)}
            rctn={props.rctn}
            updt={(Math.floor(Date.now() / 1000) - parseInt(props.desc.crtd, 10)) >= (5 * 60)}
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
