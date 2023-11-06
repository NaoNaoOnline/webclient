import { MouseEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

import spacetime, { Spacetime } from "spacetime";

import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { useCache } from "@/components/app/cache/CacheContext";

import Content from "@/components/app/event/Content";
import Footer from "@/components/app/event/Footer";
import Header from "@/components/app/event/Header";

import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastContext";

import { useToken } from "@/components/app/token/TokenContext";

import { DescriptionSearch } from "@/modules/api/description/search/Search";
import DescriptionSearchObject from "@/modules/api/description/search/Object";
import { DescriptionSearchResponse } from "@/modules/api/description/search/Response";
import { EventSearch } from "@/modules/api/event/search/Search";
import EventSearchObject from "@/modules/api/event/search/Object";
import { EventSearchRequest } from "@/modules/api/event/search/Request";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { UserSearch } from "@/modules/api/user/search/Search";

interface Props {
  cate?: string[];
  evnt?: string[];
  host?: string[];
  list?: string;
  rctn?: string;
  strt?: string;
  stop?: string;
  time?: string;
  user?: string;
}

interface ToggleState {
  [evnt: string]: boolean;
}

export function Event(props: Props) {
  const { labl } = useCache();
  const { addErro, addInfo } = useToast();
  const { auth, atkn } = useToken();
  const { user } = useUser();

  const qury: string = newQury(props);

  const [desc, setDesc] = useState<DescriptionSearchObject[] | null>(null);
  const [evnt, setEvnt] = useState<EventSearchObject[] | null>(null);
  const [form, setForm] = useState<ToggleState>({});
  const [ldng, setLdng] = useState<boolean>(true);
  const [salt, setSalt] = useState<string>(qury);
  const [xpnd, setXpnd] = useState<ToggleState>({});

  const clld: MutableRefObject<boolean> = useRef(false);

  const info: InfoPropsObject = new InfoPropsObject("The beavers need you to login if you want to add a new description.");

  const addDesc = (des: DescriptionSearchObject) => {
    setDesc((old: DescriptionSearchObject[] | null) => {
      if (old) return [...old, new DescriptionSearchObject({
        // local
        imag: user?.picture || "",
        name: user?.public?.name || "",
        // extern
        extern: [],
        // intern
        crtd: des.unix(),
        desc: des.desc(),
        user: user?.intern?.uuid || "",
        // public
        evnt: des.evnt(),
        text: des.text(),
      })];
      return old;
    });
  };

  const remDesc = (des: DescriptionSearchObject) => {
    setDesc((old: DescriptionSearchObject[] | null) => {
      if (old) return old.filter((x) => des.desc() !== x.desc());
      return old;
    });
  };

  const updDesc = (des: DescriptionSearchObject) => {
    setDesc((old: DescriptionSearchObject[] | null) => {
      if (old) return old.map((x) => (des.desc() === x.desc() ? des : x));
      return old;
    });
  };

  const remEvnt = (eve: EventSearchObject) => {
    setEvnt((old: EventSearchObject[] | null) => {
      if (old) return old.filter((x) => eve.evnt() !== x.evnt());
      return old;
    });
  };

  const tglForm = (evnt: string) => {
    setForm((old) => ({
      ...old,
      [evnt]: !old[evnt] || false,
    }));
  };

  const tglXpnd = (evnt: string) => {
    setXpnd((old) => ({
      ...old,
      [evnt]: !old[evnt] || false,
    }));
  };

  let fltr: Record<string, DescriptionSearchObject[]> = {};
  if (evnt && desc) {
    evnt.forEach((x: EventSearchObject) => fltr[x.evnt()] = filDesc(x, [...desc]));
  }

  let ltst: EventSearchObject[] = evnt || [];
  if (evnt && !props.evnt) {
    ltst = latEvnt(evnt);
  }

  let past: EventSearchObject[] = evnt || [];
  if (evnt && !props.evnt) {
    past = pasEvnt(evnt);
  }

  useEffect(() => {
    const getData = async function (): Promise<void> {
      try {
        let req: EventSearchRequest[] = [];
        if (labl && (props.cate || props.host)) {
          req = [{
            atkn: "",
            cate: getLabl(labl, props.cate),
            evnt: "",
            host: getLabl(labl, props.host),
            list: "",
            rctn: "",
            strt: "",
            stop: "",
            time: "",
            user: "",
          }];
        }

        if (props.evnt) {
          req = props.evnt.map(x => ({
            atkn: "",
            cate: "",
            evnt: x,
            host: "",
            list: "",
            rctn: "",
            strt: "",
            stop: "",
            time: "",
            user: "",
          }));
        }

        if (props.list) {
          req = [{
            atkn: "",
            cate: "",
            evnt: "",
            host: "",
            list: props.list,
            rctn: "",
            strt: "",
            stop: "",
            time: "",
            user: "",
          }];
        }

        if (props.strt && props.stop && props.rctn) {
          req = [{
            atkn: atkn,
            cate: "",
            evnt: "",
            host: "",
            list: "",
            rctn: props.rctn,
            strt: props.strt,
            stop: props.stop,
            time: "",
            user: "",
          }];
        }

        if (props.strt && props.stop && props.time) {
          req = [{
            atkn: "",
            cate: "",
            evnt: "",
            host: "",
            list: "",
            rctn: "",
            strt: props.strt,
            stop: props.stop,
            time: props.time,
            user: "",
          }];
        }

        if (props.user) {
          const usr = await UserSearch([{ user: "", name: props.user, self: false }]);
          req = [{
            atkn: "",
            cate: "",
            evnt: "",
            host: "",
            list: "",
            rctn: "",
            strt: "",
            stop: "",
            time: "",
            user: usr[0].user,
          }];
        }

        const evn = await EventSearch(req);

        if (evn.length === 0) {
          setLdng(false);
          return;
        }

        const des = await DescriptionSearch(evn.map(x => ({ atkn: atkn, evnt: x.evnt })));
        const usr = await UserSearch(uniUser(des).map(x => ({ user: x, name: "", self: false })));

        setEvnt(evn.map((x) => new EventSearchObject(x)));
        setDesc(des.map((x) => {
          const u = usr.find(y => y.user === x.user);
          if (u) {
            return new DescriptionSearchObject({
              ...x,
              imag: u.imag,
              name: u.name,
            });
          } else {
            return new DescriptionSearchObject(x);
          }
        }));

        setLdng(false);
      } catch (err) {
        addErro(new ErrorPropsObject("By Zeus' beard, the beavers built a dam and all the events got stuck!", err as Error));
        setLdng(false);
      }
    };

    if (!clld.current && labl) {
      clld.current = true;
      getData();
    }
  }, [props, atkn, labl, addErro]);

  useEffect(() => {
    if (qury !== salt) {
      clld.current = false;
      setSalt(qury);
    }
  }, [qury, salt]);

  return (
    <>
      {!ldng && (
        <>
          {ltst.length !== 0 && (
            <>
              {desc && Object.keys(fltr).length !== 0 && labl && (
                <ul>
                  {ltst.map((x, i) => (
                    <li key={i}>
                      <Header
                        desc={fltr[x.evnt()]}
                        evnt={x}
                        labl={labl}
                      />

                      <Content
                        cncl={() => tglForm(x.evnt())}
                        desc={fltr[x.evnt()]}
                        dadd={(des: DescriptionSearchObject) => {
                          if (fltr[x.evnt()].length === 1 && !xpnd[x.evnt()]) tglXpnd(x.evnt())
                          addDesc(des);
                        }}
                        drem={remDesc}
                        dupd={updDesc}
                        evnt={x}
                        form={form[x.evnt()]}
                        labl={labl}
                        xpnd={xpnd[x.evnt()]}
                      />

                      {fltr[x.evnt()].length > 1 && (
                        <div className="relative w-full h-0 z-1 grid justify-items-center">
                          <button
                            className={`absolute top-[-10px] bg-gray-50 dark:bg-gray-800 rounded-full shadow-gray-300 dark:shadow-gray-900 shadow-[0_0_1px_1px] outline-none group`}
                            type="button"
                            onClick={(evn: MouseEvent<HTMLButtonElement>) => {
                              evn.stopPropagation();
                              if (xpnd[x.evnt()] && form[x.evnt()]) tglForm(x.evnt());
                              tglXpnd(x.evnt());
                            }}
                          >
                            <ChevronDownIcon className={`w-5 h-4 mt-[1px] mx-2 text-gray-400 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-50 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 ${xpnd[x.evnt()] ? "rotate-180" : ""}`} />
                          </button>
                        </div>
                      )}

                      <Footer
                        dadd={() => {
                          if (!auth) {
                            addInfo(info);
                          } else {
                            tglForm(x.evnt());
                          }
                        }}
                        desc={fltr[x.evnt()]}
                        erem={remEvnt}
                        evnt={x}
                        labl={labl}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          {props.evnt?.length !== 1 && ltst.length === 0 && (
            <>
              <div className="flex my-4 w-full text-4xl justify-center">
                <span>🤨</span>
              </div>
              <div className="flex mb-8 w-full text-2xl justify-center">
                <span className="text-gray-400 dark:text-gray-500">There are no events. Beavers ate them all!</span>
              </div>
            </>
          )}
          {!props.evnt && past.length !== 0 && desc && Object.keys(fltr).length !== 0 && labl && (
            <>
              <h3 className="text-3xl mb-4 text-gray-400 dark:text-gray-500">
                Already Happened
              </h3>
              <ul>
                {past.map((x, i) => (
                  <li key={i}>
                    <Header
                      desc={fltr[x.evnt()]}
                      evnt={x}
                      labl={labl}
                    />

                    <Content
                      cncl={() => tglForm(x.evnt())}
                      desc={fltr[x.evnt()]}
                      dadd={(des: DescriptionSearchObject) => {
                        if (fltr[x.evnt()].length === 1 && !xpnd[x.evnt()]) tglXpnd(x.evnt())
                        addDesc(des);
                      }}
                      drem={remDesc}
                      dupd={updDesc}
                      evnt={x}
                      form={form[x.evnt()]}
                      labl={labl}
                      xpnd={xpnd[x.evnt()]}
                    />

                    {fltr[x.evnt()].length > 1 && (
                      <div className="relative w-full h-0 z-1 grid justify-items-center">
                        <button
                          className={`absolute top-[-10px] bg-gray-50 dark:bg-gray-800 rounded-full shadow-gray-300 dark:shadow-gray-900 shadow-[0_0_1px_1px] outline-none group`}
                          type="button"
                          onClick={(evn: MouseEvent<HTMLButtonElement>) => {
                            evn.stopPropagation();
                            if (xpnd[x.evnt()] && form[x.evnt()]) tglForm(x.evnt());
                            tglXpnd(x.evnt());
                          }}
                        >
                          <ChevronDownIcon className={`w-5 h-4 mt-[1px] mx-2 text-gray-400 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-50 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 ${xpnd[x.evnt()] ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                    )}

                    <Footer
                      dadd={() => {
                        if (!auth) {
                          addInfo(info);
                        } else {
                          tglForm(x.evnt());
                        }
                      }}
                      desc={fltr[x.evnt()]}
                      erem={remEvnt}
                      evnt={x}
                      labl={labl}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </>
  );
};

const getLabl = (lab: LabelSearchResponse[], nam: string[] | undefined): string => {
  if (!nam) {
    return "";
  }

  const ids: string[] = [];

  for (const x of nam) {
    const lsr: LabelSearchResponse | undefined = lab.find((y) => y.name.toLocaleLowerCase() === x.toLocaleLowerCase());

    if (lsr) {
      ids.push(lsr.labl);
    }
  }

  return ids.join(",");
}

const filDesc = (evn: EventSearchObject, des: DescriptionSearchObject[]): DescriptionSearchObject[] => {
  des.sort((x: DescriptionSearchObject, y: DescriptionSearchObject) => {
    // Sort descriptions by cumulative like count in descending order at first.
    const xam = x.likeAmnt();
    const yam = y.likeAmnt();

    if (yam !== xam) {
      return yam - xam;
    }

    // Sort descriptions by creation time in ascending order as secondary
    // measure.
    const xti = Number(x.unix());
    const yti = Number(y.unix());

    return xti - yti;
  });

  return des.filter((y: DescriptionSearchObject) => y.evnt() === evn.evnt());
}


// latEvnt returns a list of event objects for the events happening right now.
// The list is sorted by event start time, from earlier to later.
const latEvnt = (evn: EventSearchObject[]): EventSearchObject[] => {
  // Keep all the events that have not already happened.
  const now: Spacetime = spacetime.now();
  evn = evn.filter((x) => !x.hpnd(now));

  // Sort the events based on their time, in ascending order.
  evn.sort((x: EventSearchObject, y: EventSearchObject) => x.time().epoch - y.time().epoch);

  return evn;
}

const newQury = (props: Props): string => {
  var qry: string[] = [];

  if (props.cate) qry.push("cate", ...props.cate);
  if (props.evnt) qry.push("evnt", ...props.evnt);
  if (props.host) qry.push("host", ...props.host);
  if (props.list) qry.push("list", props.list);
  if (props.rctn) qry.push("rctn", props.rctn);
  if (props.time) qry.push("time", props.time);
  if (props.user) qry.push("user", props.user);

  return qry.join(":");
}

// pasEvnt returns a list of event objects for the events that have already
// happened. The list is sorted by event start time, from earlier to later.
const pasEvnt = (evn: EventSearchObject[]): EventSearchObject[] => {
  // Keep all the events that have already happened.
  const now: Spacetime = spacetime.now();
  evn = evn.filter((x) => x.hpnd(now));

  // Sort the events based on their time, in ascending order.
  evn.sort((x: EventSearchObject, y: EventSearchObject) => y.time().epoch - x.time().epoch);

  return evn;
}

// uniUser extracts unique user names from a list of descriptions and returns
// them as a list of strings.
const uniUser = (des: DescriptionSearchResponse[]): string[] => {
  const usr: Record<string, boolean> = {};
  const uni: string[] = [];

  for (const x of des) {
    if (!usr[x.user]) {
      usr[x.user] = true;
      uni.push(x.user);
    }
  }

  return uni;
}
