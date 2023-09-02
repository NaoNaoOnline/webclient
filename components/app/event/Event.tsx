import { useEffect, useRef, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import Content from '@/components/app/event/Content'
import Footer from '@/components/app/event/Footer'
import Header from '@/components/app/event/Header'

import ErrorToast from '@/components/app/toast/ErrorToast'
import LoginToast from '@/components/app/toast/LoginToast'

import { DescriptionSearch } from "@/modules/api/description/search/Search";
import { DescriptionSearchResponse } from '@/modules/api/description/search/Response';
import { EventSearch } from '@/modules/api/event/search/Search'
import { EventSearchObject } from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response';
import { UserSearch } from "@/modules/api/user/search/Search";
import { VoteSearch } from "@/modules/api/vote/search/Search";
import { VoteSearchResponse } from "@/modules/api/vote/search/Response";

import CacheApiLabel from '@/modules/cache/api/Label';
import CacheApiReaction from '@/modules/cache/api/Reaction';

import Errors from '@/modules/errors/Errors';

interface Props {
  atkn: string;
  evnt?: string[];
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

  const getData = async function (): Promise<void> {
    try {
      const evn = await EventSearch(!props.evnt ? [] : props.evnt.map(x => ({ evnt: x })));

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

  let ltst: EventSearchObject[] = evnt || [];
  if (evnt && !props.evnt) {
    ltst = latEvnt(evnt);
  }

  let past: EventSearchObject[] = evnt || [];
  if (evnt && !props.evnt) {
    past = pasEvnt(evnt);
  }

  useEffect(() => {
    if (!clng.current) {
      clng.current = true;
      getData();
    }
  }, []);

  return (
    <>
      {ldng && (
        <></>
      )}
      {!ldng && (
        <>
          {ltst.length !== 0 && (
            <>
              {desc && labl && rctn && vote && (
                <ul>
                  {ltst.map((x, i) => (
                    <li key={i}>
                      <Header
                        desc={filDesc(x, [...desc], vote)}
                        evnt={x}
                        labl={labl}
                        xpnd={() => tglXpnd(x.evnt())}
                      />

                      <Content
                        addd={addDesc}
                        atkn={props.atkn}
                        cncl={() => tglForm(x.evnt())}
                        desc={filDesc(x, [...desc], vote)}
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
          {!props.evnt && past.length !== 0 && desc && labl && rctn && vote && (
            <>
              <h3 className="text-3xl mb-4 text-gray-400 dark:text-gray-500">
                Already Happened
              </h3>
              <ul>
                {past.map((x, i) => (
                  <li key={i}>
                    <Header
                      desc={filDesc(x, [...desc], vote)}
                      evnt={x}
                      labl={labl}
                      xpnd={() => tglXpnd(x.evnt())}
                    />

                    <Content
                      addd={addDesc}
                      atkn={props.atkn}
                      cncl={() => tglForm(x.evnt())}
                      desc={filDesc(x, [...desc], vote)}
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
        <LoginToast
          key={i}
          desc="The beavers need you to login if you want to add a new description."
        />
      ))}
    </>
  );
};

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
  // Filter out events that have already happened.
  const now = Math.floor(Date.now() / 1000);
  evn = evn.filter((x) => x.dura() > now);

  // Sort the events based on their time, in ascending order.
  evn.sort((x: EventSearchObject, y: EventSearchObject) => x.time() - y.time());

  return evn;
}

// pasEvnt returns a list of event objects for the events that have already
// happened. The list is sorted by event start time, from earlier to later.
function pasEvnt(evn: EventSearchObject[]): EventSearchObject[] {
  // Filter out events that have already happened.
  const now = Math.floor(Date.now() / 1000);
  evn = evn.filter((x) => x.dura() < now);

  // Sort the events based on their time, in ascending order.
  evn.sort((x: EventSearchObject, y: EventSearchObject) => x.time() - y.time());

  return evn;
}

function uniUser(des: DescriptionSearchResponse[]): string[] {
  const lis: string[] = [];
  const set = new Set();

  des.forEach((x) => {
    if (!set.has(x.user)) {
      set.add(x.user);
      lis.push(x.user);
    }
  });

  return lis;
}
