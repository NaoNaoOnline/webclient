import { useEffect, useRef, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import Content from '@/components/app/event/Content'
import Footer from '@/components/app/event/Footer'
import Header from '@/components/app/event/Header'

import ErrorToast from '@/components/app/toast/ErrorToast'
import InfoToast from '@/components/app/toast/InfoToast'

import { DescriptionSearch } from "@/modules/api/description/search/Search";
import { DescriptionSearchResponse } from '@/modules/api/description/search/Response';
import { EventSearch } from '@/modules/api/event/search/Search'
import EventSearchObject from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response';
import { UserSearch } from "@/modules/api/user/search/Search";
import { VoteSearch } from "@/modules/api/vote/search/Search";
import { VoteSearchResponse } from "@/modules/api/vote/search/Response";

import CacheApiLabel from '@/modules/cache/api/Label';
import CacheApiReaction from '@/modules/cache/api/Reaction';

import Errors from '@/modules/errors/Errors';
import { EventSearchRequest } from '@/modules/api/event/search/Request';
import spacetime, { Spacetime } from 'spacetime';

interface Props {
  atkn: string;
  cate?: string[];
  evnt?: string[];
  host?: string[];
  ltst?: string;
  rctn?: string;
}

interface ToggleState {
  [evnt: string]: boolean;
}

export default function Event(props: Props) {
  const { user } = useUser();

  const [auth, setAuth] = useState<boolean[]>([]);
  const [desc, setDesc] = useState<DescriptionSearchResponse[] | null>(null);
  const [evnt, setEvnt] = useState<EventSearchObject[] | null>(null);
  const [erro, setErro] = useState<Errors | null>(null);
  const [form, setForm] = useState<ToggleState>({});
  const [labl, setLabl] = useState<LabelSearchResponse[] | null>(null);
  const [ldng, setLdng] = useState<boolean>(true);
  const [rctn, setRctn] = useState<ReactionSearchResponse[] | null>(null);
  const [vote, setVote] = useState<VoteSearchResponse[] | null>(null);
  const [xpnd, setXpnd] = useState<ToggleState>({});

  const clng = useRef(false);

  const cal: LabelSearchResponse[] = CacheApiLabel();
  if (cal && cal.length !== 0 && (!labl || labl.length === 0)) {
    setLabl(cal);
  }

  const car: ReactionSearchResponse[] = CacheApiReaction();
  if (car && car.length !== 0 && (!rctn || rctn.length === 0)) {
    setRctn(car);
  }

  const addDesc = (des: DescriptionSearchResponse) => {
    if (desc) {
      desc.push({
        // local
        imag: user?.picture || "",
        name: user?.nickname || user?.name || "",
        // intern
        crtd: des.crtd,
        desc: des.desc,
        user: user?.uuid || "",
        // public
        evnt: des.evnt,
        text: des.text,
      });
    }
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

  let fltr: Record<string, DescriptionSearchResponse[]> = {};
  if (evnt && desc && vote) {
    evnt.forEach((x: EventSearchObject) => fltr[x.evnt()] = filDesc(x, [...desc], vote));
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
          req = [{ atkn: props.atkn, cate: getLabl(labl, props.cate), host: getLabl(labl, props.host), evnt: "", ltst: "", rctn: "" }];
        }

        if (props.evnt) {
          req = props.evnt.map(x => ({ atkn: "", cate: "", host: "", evnt: x, ltst: "", rctn: "" }));
        }

        if (props.ltst) {
          req = [{ atkn: props.atkn, cate: "", host: "", evnt: "", ltst: props.ltst, rctn: "" }];
        }

        if (props.rctn) {
          req = [{ atkn: props.atkn, cate: "", host: "", evnt: "", ltst: "", rctn: props.rctn }];
        }

        const evn = await EventSearch(req);

        if (evn.length === 0) {
          setLdng(false);
          return;
        }

        const des = await DescriptionSearch(evn.map(x => ({ evnt: x.evnt })));
        const vot = await VoteSearch(des.map(x => ({ desc: x.desc })));
        const usr = await UserSearch(uniUser(des).map(x => ({ user: x })));

        setEvnt(evn.map(x => new EventSearchObject(x)));
        setDesc(des.map(x => {
          const u = usr.find(y => y.user === x.user);
          if (u) {
            return {
              ...x,
              imag: u.imag,
              name: u.name,
            };
          } else {
            return x;
          }
        }));
        setVote(vot);

        setLdng(false);
      } catch (err) {
        setErro(new Errors("By Zeus' beard, the beavers built a dam and all the events got stuck!", err as Error));
        setLdng(false);
      }
    };

    if (!clng.current && labl) {
      clng.current = true;
      getData();
    }
  }, [props.atkn, props.cate, props.evnt, props.host, props.ltst, props.rctn, labl]);

  return (
    <>
      {ldng && (
        <></>
      )}
      {!ldng && (
        <>
          {ltst.length !== 0 && (
            <>
              {desc && Object.keys(fltr).length !== 0 && labl && rctn && vote && (
                <ul>
                  {ltst.map((x, i) => (
                    <li key={i}>
                      <Header
                        desc={fltr[x.evnt()]}
                        evnt={x}
                        labl={labl}
                        xpnd={() => tglXpnd(x.evnt())}
                      />

                      <Content
                        atkn={props.atkn}
                        cncl={() => tglForm(x.evnt())}
                        desc={fltr[x.evnt()]}
                        done={(des: DescriptionSearchResponse) => {
                          if (fltr[x.evnt()].length === 1 && !xpnd[x.evnt()]) tglXpnd(x.evnt())
                          addDesc(des);
                        }}
                        evnt={x}
                        form={form[x.evnt()]}
                        labl={labl}
                        rctn={rctn}
                        vote={vote}
                        xpnd={xpnd[x.evnt()]}
                      />

                      <Footer
                        addd={() => {
                          if (props.atkn == "") {
                            setAuth((old: boolean[]) => [...old, true]);
                          } else {
                            tglForm(x.evnt());
                          }
                        }}
                        evnt={x}
                        labl={labl}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
          {ltst.length === 0 && (
            <>
              <div className="flex my-4 w-full text-4xl justify-center">
                <span>🤨</span>
              </div>
              <div className="flex mb-8 w-full text-2xl justify-center">
                <span className="text-gray-400 dark:text-gray-500">There are no events. Beavers ate them all!</span>
              </div>
            </>
          )}
          {!props.evnt && past.length !== 0 && desc && Object.keys(fltr).length !== 0 && labl && rctn && vote && (
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
                      xpnd={() => tglXpnd(x.evnt())}
                    />

                    <Content
                      atkn={props.atkn}
                      cncl={() => tglForm(x.evnt())}
                      desc={fltr[x.evnt()]}
                      done={(des: DescriptionSearchResponse) => {
                        if (fltr[x.evnt()].length === 1 && !xpnd[x.evnt()]) tglXpnd(x.evnt())
                        addDesc(des);
                      }}
                      evnt={x}
                      form={form[x.evnt()]}
                      labl={labl}
                      rctn={rctn}
                      vote={vote}
                      xpnd={xpnd[x.evnt()]}
                    />

                    <Footer
                      addd={() => {
                        if (props.atkn == "") {
                          setAuth((old: boolean[]) => [...old, true]);
                        } else {
                          tglForm(x.evnt());
                        }
                      }}
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
      {erro && (
        <ErrorToast erro={erro} />
      )}
      {auth.map((x, i) => (
        <InfoToast
          key={i}
          desc="The beavers need you to login if you want to add a new description."
        />
      ))}
    </>
  );
};

function getLabl(lab: LabelSearchResponse[], nam: string[] | undefined): string {
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

function filDesc(evn: EventSearchObject, des: DescriptionSearchResponse[], vot: VoteSearchResponse[]): DescriptionSearchResponse[] {
  // Create a lookup table to store the vote counts for each description.
  const cou: Record<string, number> = {};

  vot.forEach((x: VoteSearchResponse) => {
    if (cou[x.desc] === undefined) {
      cou[x.desc] = 0;
    }

    cou[x.desc]++;
  });

  des.sort((x: DescriptionSearchResponse, y: DescriptionSearchResponse) => {
    const xam = cou[x.desc] || 0;
    const yam = cou[y.desc] || 0;

    // Sort descriptions by cumulative vote count in descending order at first.
    if (yam !== xam) {
      return yam - xam;
    }

    // Sort descriptions by creation time in ascending order as secondary
    // measure.
    const xti = parseInt(x.crtd, 10);
    const yti = parseInt(y.crtd, 10);

    return xti - yti;
  });

  return des.filter((y: DescriptionSearchResponse) => y.evnt === evn.evnt())
}


// latEvnt returns a list of event objects for the events happening right now.
// The list is sorted by event start time, from earlier to later.
function latEvnt(evn: EventSearchObject[]): EventSearchObject[] {
  // Keep all the events that have not already happened.
  const now: Spacetime = spacetime.now();
  evn = evn.filter((x) => !x.hpnd(now));

  // Sort the events based on their time, in ascending order.
  evn.sort((x: EventSearchObject, y: EventSearchObject) => x.time().epoch - y.time().epoch);

  return evn;
}

// pasEvnt returns a list of event objects for the events that have already
// happened. The list is sorted by event start time, from earlier to later.
function pasEvnt(evn: EventSearchObject[]): EventSearchObject[] {
  // Keep all the events that have already happened.
  const now: Spacetime = spacetime.now();
  evn = evn.filter((x) => x.hpnd(now));

  // Sort the events based on their time, in ascending order.
  evn.sort((x: EventSearchObject, y: EventSearchObject) => x.time().epoch - y.time().epoch);

  return evn;
}

// uniUser extracts unique user names from a list of descriptions and returns
// them as a list of strings.
function uniUser(des: DescriptionSearchResponse[]): string[] {
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
