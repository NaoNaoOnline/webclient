import React, { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import ErrorToast from '@/components/app/event/add/ErrorToast'

import Footer from '@/components/app/event/Footer'
import Header from '@/components/app/event/Header'
import Form from '@/components/app/description/Form'
import Description from '@/components/app/description/Description'

import { DescriptionSearchResponse } from '@/modules/api/description/search/Response';
import { EventSearchObject } from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response';
import { VoteCreate } from '@/modules/api/vote/create/Create';
import { VoteDelete } from '@/modules/api/vote/delete/Delete';
import { VoteSearchResponse } from "@/modules/api/vote/search/Response";
import { VoteCreateResponse } from '@/modules/api/vote/create/Response';
import { VoteDeleteResponse } from '@/modules/api/vote/delete/Response';

interface Props {
  atkn: string;
  evnt: EventSearchObject;
  desc: DescriptionSearchResponse[];
  labl: LabelSearchResponse[];
  rctn: ReactionSearchResponse[];
  vote: VoteSearchResponse[];
}

export default function Event(props: Props) {
  const { user } = useUser();

  const [erro, setErro] = useState<Error | null>(null);
  const [form, setForm] = useState<boolean>(false);
  const [srtd, setSrtd] = useState<boolean>(false);
  const [vote, setVote] = useState<VoteSearchResponse[]>(props.vote);
  const [xpnd, setXpnd] = useState<boolean>(false);

  const doneFunc = (des: DescriptionSearchResponse | null) => {
    props.desc.push({
      // local
      imag: user?.picture || "",
      name: user?.nickname || user?.name || "",
      // intern
      crtd: des?.crtd || "",
      desc: des?.desc || "",
      user: user?.uuid || "",
      // public
      evnt: props.evnt.evnt(),
      text: des?.text || "",
    });
  };

  const voteCreate = async function (des: DescriptionSearchResponse, rct: ReactionSearchResponse): Promise<VoteCreateResponse | undefined> {
    try {
      const [vot] = await VoteCreate([{ atkn: props.atkn, desc: des.desc, rctn: rct.rctn }]);
      return vot;
    } catch (err) {
      setErro(err as Error);
    }
  };

  const voteDelete = async function (des: DescriptionSearchResponse, rct: ReactionSearchResponse): Promise<VoteDeleteResponse | undefined> {
    try {
      const vid = vote.find(x => x.desc === des.desc && x.rctn === rct.rctn && x.user === (user?.uuid || ""))?.vote || "";

      if (!vid) return undefined;

      const [vot] = await VoteDelete([{ atkn: props.atkn, vote: vid }]);
      return vot;
    } catch (err) {
      setErro(err as Error);
    }
  };

  // badd is called as "on button add" callback, which is the event invoked when
  // the user clicks on a reaction icon in the reaction button component.
  const badd = (des: DescriptionSearchResponse, rct: ReactionSearchResponse) => {
    // If the user clicked on the reaction already, the button is not allowed to
    // have any effect anymore.
    if (rct.clck) return

    vote.push({
      // intern
      crtd: "tmp",
      user: user?.uuid || "",
      vote: "tmp",
      // public
      desc: des.desc,
      rctn: rct.rctn,
    })

    setVote([...vote])

    voteCreate(des, rct).then(
      (vot: VoteCreateResponse | undefined) => {
        setVote([...vote.map((v) => {
          if (v.crtd === "tmp" && v.desc == des.desc && v.user == (user?.uuid || "") && v.vote === "tmp") {
            return {
              // intern
              crtd: vot?.crtd || "",
              user: v.user,
              vote: vot?.vote || "",
              // public
              desc: v.desc,
              rctn: v.rctn,
            };
          } else {
            return v;
          }
        })]);
      },
      (rsn: any) => {
        setVote([...vote.filter((v) => !(v.crtd === "tmp" && v.desc == des.desc && v.user == (user?.uuid || "") && v.vote === "tmp"))]);
      },
    );
  };

  // brem is called as "on button remove" callback, which is the event invoked when
  // the user clicks on a reaction icon in the reaction button component.
  const brem = (des: DescriptionSearchResponse, rct: ReactionSearchResponse) => {
    // If the user did not click on the reaction already, the button is not
    // allowed to have any effect at all.
    if (!rct.clck) return;

    setVote([...vote.filter((x) => !(x.desc === des.desc && x.rctn === rct.rctn && x.user == (user?.uuid || "")) && x.crtd != "tmp" && x.vote != "tmp")]);

    voteDelete(des, rct);
  };

  // padd is called as "on picker add" callback, which is the event invoked when
  // the user clicks on a reaction icon in the reaction picker component.
  const padd = (des: DescriptionSearchResponse, rct: ReactionSearchResponse) => {
    // If the user clicked on the reaction already, the picker is not allowed to
    // have any effect anymore.
    if (rct.clck) return;

    vote.push({
      // intern
      crtd: "tmp",
      user: user?.uuid || "",
      vote: "tmp",
      // public
      desc: des.desc,
      rctn: rct.rctn,
    })

    setVote([...vote])

    voteCreate(des, rct).then(
      (vot: VoteCreateResponse | undefined) => {
        setVote([...vote.map((v) => {
          if (v.crtd === "tmp" && v.desc == des.desc && v.user == (user?.uuid || "") && v.vote === "tmp") {
            return {
              // intern
              crtd: vot?.crtd || "",
              user: v.user,
              vote: vot?.vote || "",
              // public
              desc: v.desc,
              rctn: v.rctn,
            };
          } else {
            return v;
          }
        })]);
      },
      (rsn: any) => {
        setVote([...vote.filter((v) => !(v.crtd === "tmp" && v.desc == des.desc && v.user == (user?.uuid || "") && v.vote === "tmp"))]);
      },
    );
  };

  if (!srtd) {
    // Only sort descriptions initially on page load.
    setSrtd(true);

    // Create a lookup table to store the vote counts for each description.
    const des: Record<string, number> = {};

    vote.forEach((x: VoteSearchResponse) => {
      if (des[x.desc] === undefined) {
        des[x.desc] = 0;
      }

      des[x.desc]++;
    });

    props.desc.sort((x: DescriptionSearchResponse, y: DescriptionSearchResponse) => {
      const xam = des[x.desc] || 0;
      const yam = des[y.desc] || 0;

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
  }

  return (
    <>
      <Header
        desc={props.desc}
        evnt={props.evnt}
        labl={props.labl}
        xpnd={() => setXpnd(!xpnd)}
      />

      <div className="shadow-gray-400 dark:shadow-black shadow-[0_0_2px]">
        {!xpnd && (
          <Description
            badd={badd}
            brem={brem}
            desc={props.desc[0]}
            evnt={props.evnt}
            padd={padd}
            rctn={fltr(user?.uuid || "", [...props.rctn], vote.filter((v) => v.desc === props.desc[0].desc))}
          />
        )}
        {xpnd && (
          <>
            {props.desc.map((x, i) => (
              <Description
                key={i}
                badd={badd}
                brem={brem}
                desc={x}
                evnt={props.evnt}
                padd={padd}
                rctn={fltr(user?.uuid || "", [...props.rctn], vote.filter((v) => v.desc === x.desc))}
              />
            ))}
          </>
        )}
        {form && (
          <Form
            atkn={props.atkn}
            cncl={() => setForm(false)}
            done={doneFunc}
            evnt={props.evnt.evnt()}
          />
        )}
      </div>

      <Footer
        addd={() => setForm(true)}
        evnt={props.evnt}
        labl={props.labl}
      />

      {erro && (
        <ErrorToast error={erro} />
      )}
    </>
  );
};

function fltr(usr: string, rct: ReactionSearchResponse[], vot: VoteSearchResponse[]): ReactionSearchResponse[] {
  const cou: Record<string, number> = {};
  const clc: Record<string, boolean> = {};

  vot.forEach((x: VoteSearchResponse) => {
    if (cou[x.rctn] === undefined) {
      cou[x.rctn] = 0;
    }
    cou[x.rctn]++;

    if (x.user === usr) {
      clc[x.rctn] = true;
    }
  });

  // Create a new array to store the modified reactions for each description
  // component without causing side effects when looping over all of them.
  const lis: ReactionSearchResponse[] = [];

  rct.forEach((x: ReactionSearchResponse) => {
    const y = { ...x };

    y.amnt = cou[x.rctn] || 0;
    y.clck = clc[x.rctn] || false;

    lis.push(y);
  });

  return lis;
}

