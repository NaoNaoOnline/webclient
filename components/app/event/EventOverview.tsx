import { MutableRefObject, useEffect, useRef, useState } from "react";

import spacetime, { Spacetime } from "spacetime";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { useCache, hasPrm } from "@/components/app/cache/CacheProvider";
import { PageHeader } from "@/components/app/layout/PageHeader";
import { EventContainer } from "@/components/app/event/EventContainer";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { DescriptionSearch } from "@/modules/api/description/search/Search";
import DescriptionSearchObject from "@/modules/api/description/search/Object";
import { DescriptionSearchResponse } from "@/modules/api/description/search/Response";
import { EventSearch } from "@/modules/api/event/search/Search";
import EventSearchObject from "@/modules/api/event/search/Object";
import { EventSearchRequest } from "@/modules/api/event/search/Request";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { ListUpdate } from "@/modules/api/list/update/Update";
import { UserSearch } from "@/modules/api/user/search/Search";
import { ListSearchResponse } from "@/modules/api/list/search/Response";

interface Props {
  cate?: string[];
  evnt?: string[];
  host?: string[];
  like?: string;
  list?: string;
  kind: string;
  strt: string;
  stop: string;
  time?: string;
  titl?: string;
  user?: string;
}

export const EventOverview = (props: Props) => {
  const { labl, list, updList } = useCache();
  const { atkn, auth } = useAuth();
  const { addErro } = useToast();

  const qury: string = newQury(props);

  const [desc, setDesc] = useState<DescriptionSearchObject[] | null>(null);
  const [evnt, setEvnt] = useState<EventSearchObject[] | null>(null);
  const [ldng, setLdng] = useState<boolean>(true);
  const [salt, setSalt] = useState<string>(qury);

  const clld: MutableRefObject<boolean> = useRef(false);
  const updt: MutableRefObject<boolean> = useRef(false);

  const addDesc = (des: DescriptionSearchObject) => {
    setDesc((old: DescriptionSearchObject[] | null) => {
      if (old) return [...old, des];
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

  let fltr: Record<string, DescriptionSearchObject[]> = {};
  if (evnt && desc) {
    evnt.forEach((x: EventSearchObject) => fltr[x.evnt()] = filDesc(x, [...desc]));
  }

  let ltst: EventSearchObject[] = evnt || [];
  if (evnt && !props.evnt) {
    ltst = latEvnt(evnt);
  }

  let hpnd: EventSearchObject[] = evnt || [];
  if (evnt && !props.evnt) {
    hpnd = pasEvnt(evnt);
  }

  useEffect(() => {
    const getData = async function (): Promise<void> {
      try {
        let req: EventSearchRequest[] = [];
        if (labl && (props.cate || props.host)) {
          req = [{
            atkn: atkn,
            cate: getLabl(labl, props.cate),
            evnt: "",
            host: getLabl(labl, props.host),
            like: "",
            list: "",
            kind: props.kind,
            strt: props.strt,
            stop: props.stop,
            time: "",
            user: "",
          }];
        }

        if (props.evnt) {
          req = props.evnt.map(x => ({
            atkn: atkn,
            cate: "",
            evnt: x,
            host: "",
            like: "",
            list: "",
            kind: props.kind,
            strt: props.strt,
            stop: props.stop,
            time: "",
            user: "",
          }));
        }

        if (props.list) {
          req = [{
            atkn: atkn,
            cate: "",
            evnt: "",
            host: "",
            like: "",
            list: props.list,
            kind: props.kind,
            strt: props.strt,
            stop: props.stop,
            time: "",
            user: "",
          }];
        }

        if (props.like) {
          const [use] = await UserSearch([{ user: "", name: props.like, self: false }]);
          req = [{
            atkn: atkn,
            cate: "",
            evnt: "",
            host: "",
            like: use.user,
            list: "",
            kind: props.kind,
            strt: props.strt,
            stop: props.stop,
            time: "",
            user: "",
          }];
        }

        if (props.time) {
          req = [{
            atkn: atkn,
            cate: "",
            evnt: "",
            host: "",
            like: "",
            list: "",
            kind: props.kind,
            strt: props.strt,
            stop: props.stop,
            time: props.time,
            user: "",
          }];
        }

        if (props.user) {
          const [use] = await UserSearch([{ user: "", name: props.user, self: false }]);
          req = [{
            atkn: atkn,
            cate: "",
            evnt: "",
            host: "",
            like: "",
            list: "",
            kind: props.kind,
            strt: props.strt,
            stop: props.stop,
            time: "",
            user: use.user,
          }];
        }

        const evn = await EventSearch(req);

        if (evn.length === 0) {
          setEvnt([]);
          setLdng(false);
          return;
        }

        setEvnt(evn.map((x) => new EventSearchObject(x)));

        const des = await DescriptionSearch(evn.map(x => ({ atkn: atkn, evnt: x.evnt, user: "" })));

        // Since event and description objects are separate resources linked
        // together, their resource lifecycles are separate as well. The
        // implication here being that events may not have any description
        // intermittently if something went awry during the event creation
        // process. We then need to guard against empty RPCs throwing errors.
        if (des.length === 0) {
          setLdng(false);
          return;
        }

        const use = await UserSearch(uniUser(des).map(x => ({ user: x, name: "", self: false })));

        setDesc(des.map((x) => {
          const u = use.find(y => y.user === x.user);
          if (u) {
            return new DescriptionSearchObject({
              ...x,
              imag: u.imag,
              name: u.name,
              prem: hasPrm(u.prem, Date.now() / 1000),
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

    if (!clld.current) {
      clld.current = true;
      getData();
    }
  }, [props, atkn, labl, salt, addErro]); // Note the salt as dependency

  // Since NextJS operates in parts like a single-page-app, we may want to
  // render content using the same react components, but with different input.
  // One example for this are all pages generated from lists. If the user
  // watches a list and then switches to another list, the event component is
  // re-rendered, just with another list ID. Here we keep track of our internal
  // salt and reconcile it with the external query. If the query changes, we
  // want to fetch new data once. Fetching once is the reason why we use the
  // "called ref".
  useEffect(() => {
    if (qury !== salt) {
      clld.current = false;
      setSalt(qury);
    }
  }, [qury, salt]);

  useEffect(() => {
    if (!auth || ldng) return;

    const lob: ListSearchResponse | undefined = list.find((x: ListSearchResponse) => (x.list === props.list && x.feed && x.feed !== ""));

    if (!lob) return;

    const updateFeed = async () => {
      try {
        const now: string = Math.floor(spacetime.now().epoch / 1000).toString();
        await ListUpdate([{ atkn: atkn, desc: "", feed: now, list: lob.list }]);
        updList(lob, { ...lob, feed: now });
      } catch (err) {
        console.error(err);
      }
    };

    if (!updt.current) {
      updt.current = true;
      updateFeed();
    }
  }, [props.list, auth, ldng]);

  // We are trying to prevent multiple re-renderings here. Without the checks
  // below we will see the "There are no events." screen while the actual
  // content is loading.
  if (qury !== salt) return <></>;
  if (ldng === true) return <></>;

  return (
    <>
      <PageHeader titl={props.titl || "Latest Events"} />

      {ltst.length === 0 && (
        <div className="m-8">
          <div className="flex mb-4 text-4xl justify-center">
            <span>🤨</span>
          </div>
          <div className="flex text-2xl justify-center">
            <span className="text-gray-500 dark:text-gray-500">There are no events. Beavers ate them all!</span>
          </div>
        </div>
      )}

      {ltst.length !== 0 && (
        <ul>
          {ltst.map((x, i) => (
            <EventContainer
              key={x.evnt()}
              dadd={addDesc}
              desc={fltr[x.evnt()]}
              drem={remDesc}
              dupd={updDesc}
              evnt={x}
              erem={remEvnt}
            />
          ))}
        </ul>
      )}
      {!props.evnt && hpnd.length !== 0 && labl && (
        <>
          <PageHeader titl="Already Happened" />

          <ul>
            {hpnd.map((x, i) => (
              <EventContainer
                key={x.evnt()}
                dadd={addDesc}
                desc={fltr[x.evnt()]}
                drem={remDesc}
                dupd={updDesc}
                evnt={x}
                erem={remEvnt}
              />
            ))}
          </ul>
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
  if (props.like) qry.push("like", props.like);
  if (props.list) qry.push("list", props.list);
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
  const use: Record<string, boolean> = {};
  const uni: string[] = [];

  for (const x of des) {
    if (!use[x.user]) {
      use[x.user] = true;
      uni.push(x.user);
    }
  }

  return uni;
}
