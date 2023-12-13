import { MouseEvent, MutableRefObject, useEffect, useRef, useState } from "react";

import spacetime from "spacetime";

import { CgAddR } from "react-icons/cg";
import { RiHome4Line } from "react-icons/ri";
import { RiListUnordered } from "react-icons/ri";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { NaoNaoIcon } from "@/components/app/icon/NaoNaoIcon";
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

  const getData = async function (): Promise<void> {
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
            strt: String(Number(x.feed) + 1),
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
  };

  const reqAuth = (str: string) => {
    return (evn: MouseEvent<HTMLAnchorElement>) => {
      if (!auth) {
        evn.preventDefault();
        addInfo(new InfoPropsObject(str));
      }
    };
  };

  useEffect(() => {
    if (!auth) return;

    if (!clld.current) {
      clld.current = true;
      getData();
    }
  }, [auth, list]);

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
            icon={x.list === user?.home ? <RiHome4Line /> : <RiListUnordered />}
          />
        </li>
      ))}

      <li
        className="relative flex"
      >
        <ActiveButton
          href="/event/create"
          text={<>Add Event</>}
          icon={<CgAddR />}
          blue={true}
          clck={reqAuth("Join the beavers and login if you want to add a new event. Or else!")}
        />
      </li>
    </ul >
  );
};

// feeBdg expresses whether the respective list's feed notification badge should
// be shown.
const feeBdg = (lob: ListSearchResponse, dic: Record<string, string[]>): boolean => {
  if (!lob.feed || lob.feed === "") return false;
  if (!dic[lob.list] || dic[lob.list].length === 0) return false;
  return true;
}
