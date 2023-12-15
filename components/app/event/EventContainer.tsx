import { MouseEvent, useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import spacetime, { Spacetime } from "spacetime";

import { MenuAddLineIcon } from "@/components/app/icon/base/MenuAddLineIcon";
import { ChevronDownIcon } from "@/components/app/icon/base/ChevronDownIcon";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { useCache } from "@/components/app/cache/CacheProvider";
import { EventBody } from "@/components/app/event/EventBody";
import { EventFooter } from "@/components/app/event/EventFooter";
import { EventHeader } from "@/components/app/event/EventHeader";
import { ListDialog } from "@/components/app/list/dialog/ListDialog";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import EventSearchObject from "@/modules/api/event/search/Object";
import { EventUpdate } from "@/modules/api/event/update/Update";
import DescriptionSearchObject from "@/modules/api/description/search/Object";

interface Props {
  evnt: EventSearchObject;
  dadd: (des: DescriptionSearchObject) => void;
  desc: DescriptionSearchObject[];
  drem: (des: DescriptionSearchObject) => void;
  dupd: (des: DescriptionSearchObject) => void;
  erem: (eve: EventSearchObject) => void;
}

export function EventContainer(props: Props) {
  const patnam = usePathname();

  const { atkn, auth } = useAuth();
  const { labl } = useCache();
  const { addInfo } = useToast();

  const [form, setForm] = useState<boolean>(false);
  const [sdlg, setSdlg] = useState<boolean>(false); // show list dialog
  const [stat, setStat] = useState<number>(defSta(props.evnt));
  const [xpnd, setXpnd] = useState<boolean>(false);

  const idpg: boolean = eidPag(patnam);
  const info: InfoPropsObject = new InfoPropsObject("The beavers need you to login if you want to add a new description.");

  const tglForm = () => {
    setForm((old) => !old);
  };

  const tglXpnd = () => {
    setXpnd((old) => !old);
  };

  const updateClick = async (eve: MouseEvent<HTMLAnchorElement>) => {
    // We only want to track clicks on event links for authenticated users,
    // because those are users we can prevent counting twice.
    if (!auth) return;
    // We only want to track clicks on event links as long as the event has not
    // finished yet, because those are the clicks that effectively matter to
    // people.
    if (props.evnt.hpnd(spacetime.now())) return;

    try {
      const [upd] = await EventUpdate([{ atkn: atkn, evnt: props.evnt.evnt(), link: "add" }]);
    } catch (err) {
      // Since we track event clicks silently, there are no toasts and no errors
      // to be reported. We can simply log in the developer console.
      console.error(err);
    }
  };

  // Setup a periodic state change for updating the time based information in
  // the user interface every 5 seconds. Every time the setInterval callback is
  // executed the whole component re-renders using the updated clock time. We
  // track the event state in numerical terms as follows.
  //
  //     -2, far out, display as +1
  //     -1, upcoming
  //      0, ongoing
  //     +1, happened
  //
  useEffect(() => {
    const x = setInterval(() => {
      const sta: number = defSta(props.evnt);

      if (sta !== stat) {
        setStat(sta);
      }
    }, 5 * 1000); // every 5 seconds

    return () => clearInterval(x);
  }, [props.evnt, stat]);

  return (
    <li>
      <div
        className="flex"
      >

        <div
          className="flex-1"
        >
          <button
            onClick={(eve: MouseEvent<HTMLButtonElement>) => {
              if (!auth) {
                addInfo(new InfoPropsObject("Breh, you gotta login for that, mhh mhmhh!"));
              } else {
                setSdlg(true);
              }
            }}
            className="relative h-full px-3 my-auto outline-none group"
            type="button"
          >
            <MenuAddLineIcon
              className={`
                w-5 h-5 text-gray-400 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-50
              `}
            />
          </button>
        </div>

        <div
          className="flex justify-end"
        >

          <Link
            href={props.evnt.link()}
            onClick={updateClick}
            target="_blank"
            className={`
              m-3 mr-2 text-right text-3xl font-bold font-mono tracking-wider
              hover:underline hover:underline-offset-8
              ${stat === 0 ? "text-green-400" : "text-gray-400 dark:text-gray-400"}
            `}
          >

            [{props.evnt.evnt().slice(-4)}]

          </Link>

        </div>
      </div>

      <div
        className="rounded-md bg-gray-50 dark:bg-gray-700 shadow-gray-400 dark:shadow-black shadow-[0_0_2px]"
      >
        <EventHeader
          cupd={updateClick}
          evnt={props.evnt}
          labl={labl}
          stat={stat}
        />

        <EventBody
          cncl={tglForm}
          desc={props.desc}
          dadd={(des: DescriptionSearchObject) => {
            if (props.desc?.length === 1 && !xpnd) {
              tglXpnd()
            }
            props.dadd(des);
          }}
          drem={props.drem}
          dupd={props.dupd}
          evnt={props.evnt}
          form={form}
          labl={labl}
          xpnd={xpnd || idpg}
        />

        {props.desc?.length > 1 && !idpg && (
          <div className="relative w-full h-0 z-1 grid justify-items-center">
            <button
              className="absolute top-[-10px] bg-gray-200 dark:bg-gray-800 rounded-full shadow-gray-300 dark:shadow-gray-900 shadow-[0_0_1px_1px] outline-none group"
              type="button"
              onClick={(evn: MouseEvent<HTMLButtonElement>) => {
                evn.stopPropagation();
                if (xpnd && form) {
                  tglForm();
                }
                tglXpnd();
              }}
            >
              <ChevronDownIcon
                className={`
                  w-5 h-4 mt-[1px] mx-2 text-gray-500 dark:text-gray-500
                  group-hover:text-gray-900 dark:group-hover:text-gray-50
                  ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300
                  ${xpnd ? "rotate-180" : ""}
                `}
              />
            </button>
          </div>
        )}

        <EventFooter
          dadd={() => {
            if (!auth) {
              addInfo(info);
            } else {
              tglForm();
            }
          }}
          desc={props.desc}
          erem={props.erem}
          evnt={props.evnt}
          idpg={idpg}
          labl={labl}
        />
      </div>

      <ListDialog
        clos={() => setSdlg(false)}
        desc={props.desc}
        evnt={props.evnt}
        labl={labl}
        sdlg={sdlg}
      />
    </li >
  );
};

const defSta = (eve: EventSearchObject): number => {
  const now: Spacetime = spacetime.now();

  if (eve.upcm(now)) {
    return -1;
  }

  if (eve.actv(now)) {
    return 0;
  }

  if (eve.hpnd(now)) {
    return +1;
  }

  return -2;
}

// eidPag expresses whether the URL path of the current page complies with the
// URL format of the event page as shown below.
//
//     /event/1698943315449571
//
const eidPag = (str: string): boolean => {
  const spl = str.split('/');

  if (spl.length >= 2 && spl[spl.length - 2] === "event") {
    return !isNaN(Number(spl[spl.length - 1]))
  }

  return false;
}
