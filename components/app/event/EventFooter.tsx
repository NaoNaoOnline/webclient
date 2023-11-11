import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import spacetime, { Spacetime } from "spacetime";

import { BiBarChart } from "react-icons/bi";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { useCache } from "@/components/app/cache/CacheProvider";
import { EventMenu } from "@/components/app/event/EventMenu";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import DescriptionSearchObject from "@/modules/api/description/search/Object";
import { EventDelete } from "@/modules/api/event/delete/Delete";
import EventSearchObject from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { FormatNumber } from "@/modules/number/Format";
import { AccessDelete, SystemEvnt } from "@/modules/policy/Policy";

interface Props {
  dadd: () => void;
  desc: DescriptionSearchObject[];
  erem: (eve: EventSearchObject) => void;
  evnt: EventSearchObject;
  idpg: boolean;
  labl: LabelSearchResponse[];
}

export function EventFooter(props: Props) {
  const nxtrtr = useRouter();
  const { atkn, uuid } = useAuth();
  const { hasAcce } = useCache();

  const { addErro, addPgrs, addScss } = useToast();
  const { user } = useUser();

  const now: Spacetime = spacetime.now();
  const lin: number = props.evnt.linkAmnt();

  const dmax: boolean = props.desc?.length >= 50;                // description limit per event
  const hpnd: boolean = props.evnt?.hpnd(now);                   // event already happened
  const ownr: boolean = props.evnt?.ownr(user);                  // current user is event owner
  const mdrt: boolean = hasAcce(SystemEvnt, uuid, AccessDelete); // current user is moderator

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
        if (props.idpg) nxtrtr.push("/");
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      addErro(new ErrorPropsObject("The beavers are sick of it, no more carpin' all them diems!", err as Error));
    }
  };

  return (
    <div className="flex flex-row w-full mb-4 shadow-gray-400 dark:shadow-black shadow-[0px_-1px_2px_-1px]">
      {props.evnt.cate(props.labl).map((x, i) => (
        <Link
          key={i}
          href={`/event?cate=${encodeURIComponent(x.name)}`}
          className="flex-1 ml-3 py-3 text-sm font-medium whitespace-nowrap text-sky-500 hover:underline"
        >
          #{x.name}
        </Link>
      ))}

      <Link
        href={"/event/" + props.evnt.evnt()}
        className="w-full"
      />

      {lin !== 0 && (
        <div
          className="flex flex-row w-fit items-center"
        >
          <span className="flex-1 w-fit text-xs whitespace-nowrap text-gray-500 dark:text-gray-500">
            {FormatNumber(lin)}
          </span>
          <span
            className="flex-1 p-3"
          >
            <Tooltip
              desc={
                <div>
                  <div>the number of clicks</div>
                  <div>on the event link   </div>
                </div>
              }
              side="left"
            >
              <BiBarChart
                className="w-5 h-5 text-gray-500 dark:text-gray-500"
              />
            </Tooltip>
          </span>
        </div>
      )}

      <EventMenu
        cadd={!dmax && !hpnd}
        crem={mdrt || (ownr && !hpnd)}
        dadd={props.dadd}
        erem={() => eventDelete(props.evnt)}
      />
    </div >
  );
};
