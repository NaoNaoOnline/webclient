import { MouseEvent, MutableRefObject, useCallback, useEffect, useRef, useState } from "react";

import spacetime from "spacetime";

import { AddSquareIcon } from "@/components/app/icon/base/AddSquareIcon";
import { HomeLineIcon } from "@/components/app/icon/base/HomeLineIcon";
import { ListUnorderedIcon } from "@/components/app/icon/base/ListUnorderedIcon";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { NaoNaoIcon } from "@/components/app/icon/base/NaoNaoIcon";
import { useCache } from "@/components/app/cache/CacheProvider";
import { ActiveButton } from "@/components/app/sidebar/ActiveButton";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { EventSearch } from "@/modules/api/event/search/Search";
import { EventSearchRequest } from "@/modules/api/event/search/Request";
import { ListSearchResponse } from "@/modules/api/list/search/Response";

export const ListButtons = () => {
  const { atkn, auth } = useAuth();
  const { list, user } = useCache();
  const { addErro, addInfo } = useToast();

  const [evnt, setEvnt] = useState<Record<string, string[]>>({});

  const clld: MutableRefObject<boolean> = useRef(false);

  const getData = useCallback(async function (): Promise<void> {
    try {
      const now: string = Math.floor(spacetime.now().epoch / 1000).toString();

      const req: EventSearchRequest[] = list
        .filter((x: ListSearchResponse) => {
          return x.feed && x.feed !== "";
        })
        .map((x: ListSearchResponse) => {
          return {
            atkn: atkn,
            cate: "",
            evnt: "",
            host: "",
            like: "",
            list: x.list,
            kind: "unix",
            // The paging range does always define inclusive boundaries. The
            // start of this range was the end of the last range. So in order to
            // receive the feed delta that the user did not see yet, the lower
            // boundary of the paging range here has to be incremented by 1
            // second.
            strt: String(Number(x.feed) + 1),
            // The upper boundary of the paging range is just the current time
            // in unix seconds.
            stop: now,
            time: "",
            user: "",
          };
        });

      if (req.length === 0) {
        return;
      }

      const eob = await EventSearch(req);

      const tmp: Record<string, string[]> = {};

      for (const x of eob) {
        if (!tmp[x.list]) {
          tmp[x.list] = [];
        }

        {
          tmp[x.list].push(x.evnt);
        }
      }

      clld.current = false;
      setEvnt(tmp);
    } catch (err) {
      clld.current = false;
      addErro(new ErrorPropsObject("It's down only from here, run!", err as Error));
    }
  }, [atkn, list, addErro]);

  const reqAuth = (str: string) => {
    return (evn: MouseEvent<HTMLAnchorElement>) => {
      if (!auth) {
        evn.preventDefault();
        addInfo(new InfoPropsObject(str));
      }
    };
  };

  // As soon as the user's lists change, check for notification changes. This
  // hook will fire e.g. if notifications get invalidated after a user viewed a
  // list that showed notifications in the first place. The update here will
  // then reset the feed delta, because the user caught up with the missed
  // events.
  useEffect(() => {
    if (!auth) return;

    if (!clld.current) {
      clld.current = true;
      getData();
    }
  }, [auth, list, getData]);

  // Check for list notifications every once in a while so that the user
  // receives updates for their lists while remaining on the site.
  useEffect(() => {
    if (!auth) return;

    const tim: NodeJS.Timeout = setInterval(() => {
      getData();
    }, 60 * 1000); // every 60 seconds

    return () => clearInterval(tim);
  });

  return (
    <ul>
      <li
        className="relative flex"
      >
        <ActiveButton
          href={user?.home === "" || user?.home === "/" ? "/" : "/event/latest"}
          text={<>NaoNao</>}
          icon={<NaoNaoIcon className="rounded-none" />}
        />
      </li>

      {list.map((x, i) => (
        <li
          key={x.list}
          className="relative flex"
        >
          <ActiveButton
            actv={x.list === user?.home}
            feed={feeBdg(x, evnt)}
            href={`/list/` + x.list}
            text={<>{x.desc}</>}
            icon={x.list === user?.home ? <HomeLineIcon /> : <ListUnorderedIcon />}
          />
        </li>
      ))}

      <li
        className="relative flex"
      >
        <ActiveButton
          href="/event/create"
          text={<>Add Event</>}
          icon={<AddSquareIcon />}
          blue={true}
          clck={reqAuth("Join the beavers and login if you want to add a new event. Or else!")}
        />
      </li>
    </ul >
  );
};

// feeBdg expresses whether the respective list's feed notification badge should
// be shown. If there is no feed timestamp, then notifications are disabled, so
// the notification badge should not show. If there is no feed delta for a list,
// then there are no updates to show, meaning the user has not missed anything.
// Then the notification badge should not show either.
const feeBdg = (lob: ListSearchResponse, dic: Record<string, string[]>): boolean => {
  if (!lob.feed || lob.feed === "") return false;
  if (!dic[lob.list] || dic[lob.list].length === 0) return false;
  return true;
}
