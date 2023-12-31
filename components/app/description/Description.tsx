import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import spacetime, { Spacetime } from "spacetime";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { PremiumButton } from "@/components/app/button/PremiumButton";
import { useCache } from "@/components/app/cache/CacheProvider";
import { DescriptionUpdateForm } from "@/components/app/description/update/DescriptionUpdateForm";
import { DescriptionMenu } from "@/components/app/description/DescriptionMenu";
import ReactionBar from "@/components/app/reaction/ReactionBar";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastProvider";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import DescriptionSearchObject from "@/modules/api/description/search/Object";
import EventSearchObject from "@/modules/api/event/search/Object";
import { AccessDelete, SystemDesc } from "@/modules/policy/Policy";

interface Props {
  amnt: number;
  drem: (des: DescriptionSearchObject) => void;
  desc: DescriptionSearchObject;
  evnt: EventSearchObject;
  radd: (des: DescriptionSearchObject, use: boolean) => void;
  rrem: (des: DescriptionSearchObject, use: boolean) => void;
}

export default function Description(props: Props) {
  const { uuid } = useAuth();
  const { hasAcce } = useCache();
  const { addInfo } = useToast();

  const [form, setForm] = useState<boolean>(false);
  const [text, setText] = useState<string>(props.desc.text());

  const now: Spacetime = spacetime.now();

  const hpnd: boolean = props.evnt.hpnd(now);              // event already happened
  const mdrt: boolean = hasAcce(SystemDesc, AccessDelete); // current user is moderator
  const only: boolean = props.amnt == 1;                   // the event has only one description
  const ownr: boolean = props.desc.ownr(uuid);             // current user is description owner
  const told: boolean = props.desc.cupd(now);              // description is too old

  return (
    <div className="p-1 bg-gray-200 dark:bg-gray-800 first:border-none border-t-solid border-t border-gray-50 dark:border-gray-700">
      <div className="flex">
        <div className="flex flex-row items-center">
          <Link
            href={"/user/" + encodeURIComponent(props.desc.name())}
            className="flex-1 p-2"
          >
            <Image
              alt="profile picture"
              className="w-7 h-7 rounded-full"
              height={28}
              width={28}
              src={props.desc.imag()}
            />
          </Link>
          <Link
            href={"/user/" + encodeURIComponent(props.desc.name())}
            className={`
              flex-1
              text-gray-900 dark:text-gray-50
              text-sm font-medium whitespace-nowrap
              hover:underline hover:underline-offset-2
            `}
          >
            <PremiumButton
              bool={props.desc.prem()}
              name={props.desc.name()}
            />
          </Link>
          {props.desc.user() === props.evnt.user() && (
            <Tooltip
              desc="Event Creator"
              side="right"
            >
              <span className="rounded mx-2 my-auto px-[3px] text-xs font-medium bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400 border border-sky-500 cursor-pointer">
                EC
              </span>
            </Tooltip>
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
            crem={mdrt || (ownr && !told && !hpnd && !only)}
            cupd={ownr && !told && !hpnd}
            drem={() => props.drem(props.desc)}
            dupd={() => setForm((old: boolean) => !old)}
          />
        </div>
      </div>

      {form && (
        <DescriptionUpdateForm
          cncl={() => setForm(false)}
          desc={props.desc.desc()}
          done={(txt: string) => {
            if (txt === text) {
              addInfo(new InfoPropsObject("Nothing to change here, don't worry mate. No biggie at all!"));
            } else {
              setText(txt);
            }
            setForm(false)
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
