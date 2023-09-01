import { useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import Form from '@/components/app/description/Form'
import Description from '@/components/app/description/Description'

import ErrorToast from '@/components/app/toast/ErrorToast'
import LoginToast from '@/components/app/toast/LoginToast'

import { DescriptionSearchResponse } from '@/modules/api/description/search/Response';
import { EventSearchObject } from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response';
import { VoteCreate } from '@/modules/api/vote/create/Create';
import { VoteDelete } from '@/modules/api/vote/delete/Delete';
import { VoteSearchResponse } from "@/modules/api/vote/search/Response";
import { VoteCreateResponse } from '@/modules/api/vote/create/Response';
import { VoteDeleteResponse } from '@/modules/api/vote/delete/Response';

import Errors from '@/modules/errors/Errors';

interface Props {
  addd: (des: DescriptionSearchResponse) => void;
  atkn: string;
  cncl: () => void;
  evnt: EventSearchObject;
  desc: DescriptionSearchResponse[];
  form: boolean;
  labl: LabelSearchResponse[];
  rctn: ReactionSearchResponse[];
  vote: VoteSearchResponse[];
  xpnd: boolean;
}

export default function Content(props: Props) {
  const { user } = useUser();

  const [auth, setAuth] = useState<boolean[]>([]);
  const [erro, setErro] = useState<Errors[]>([]);
  const [vote, setVote] = useState<VoteSearchResponse[]>(props.vote);

  const voteCreate = async function (des: DescriptionSearchResponse, rct: ReactionSearchResponse): Promise<VoteCreateResponse> {
    try {
      const [vot] = await VoteCreate([{ atkn: props.atkn, desc: des.desc, rctn: rct.rctn }]);
      return vot;
    } catch (err) {
      setErro((old: Errors[]) => [...old, new Errors("Darn it, the beavers don't want you to push that button right now!", err as Error)]);
      return Promise.reject(err);
    }
  };

  const voteDelete = async function (des: DescriptionSearchResponse, rct: ReactionSearchResponse): Promise<VoteDeleteResponse> {
    try {
      const vid = vote.find((x: VoteSearchResponse) => x.desc === des.desc && x.rctn === rct.rctn && x.user === (user?.uuid || ""))?.vote || "";
      const [vot] = await VoteDelete([{ atkn: props.atkn, vote: vid }]);
      return vot;
    } catch (err) {
      setErro((old: Errors[]) => [...old, new Errors("Oh no, the beavers don't want you to take it back like that!", err as Error)]);
      return Promise.reject(err);
    }
  };

  // radd is called as "on button add" callback, which is the event invoked when
  // the user clicks on a reaction icon in the reaction button component.
  //
  // radd is called as "on picker add" callback, which is the event invoked when
  // the user clicks on a reaction icon in the reaction picker component.
  const radd = (des: DescriptionSearchResponse, rct: ReactionSearchResponse) => {
    if (props.atkn == "") {
      return setAuth((old: boolean[]) => [...old, true]);
    }

    // If the user clicked on the reaction already, the button is not allowed to
    // have any effect anymore.
    if (rct.clck) return;

    const tmp: VoteSearchResponse = {
      // intern
      crtd: "tmp",
      user: user?.uuid || "",
      vote: "tmp",
      // public
      desc: des.desc,
      rctn: rct.rctn,
    };

    // For an optimistic UI approach we add a new temporary vote object right
    // away in order for the user to get instant feedback on adding their
    // reaction. Below the temporary copy will be filled with actual resource
    // data once the backend processed our request.
    vote.push(tmp)
    setVote([...vote])

    voteCreate(des, rct).then(
      // onfulfilled receives the actual resource data and replaces the tmp
      // placeholders in the user's local copy.
      (vot: VoteCreateResponse) => {
        setVote([...vote.map((x: VoteSearchResponse) => {
          if (x === tmp) {
            return {
              // intern
              crtd: vot.crtd, // replace "tmp"
              user: x.user,
              vote: vot.vote, // replace "tmp"
              // public
              desc: x.desc,
              rctn: x.rctn,
            };
          } else {
            return x;
          }
        })]);
      },
      // onrejected removes the temporary vote object from the user's local copy
      // since the backend could not process our request successfully.
      (rsn: any) => {
        setVote([...vote.filter((x: VoteSearchResponse) => x !== tmp)]);
      },
    );
  };

  // rrem is called as "on button remove" callback, which is the event invoked when
  // the user clicks on a reaction icon in the reaction button component.
  const rrem = (des: DescriptionSearchResponse, rct: ReactionSearchResponse) => {
    if (props.atkn == "") {
      return setAuth((old: boolean[]) => [...old, true]);
    }

    // If the user did not click on the reaction already, the button is not
    // allowed to have any effect at all.
    if (!rct.clck) return;

    const rem = vote.find((x: VoteSearchResponse) => x.desc === des.desc && x.rctn === rct.rctn && x.user === (user?.uuid || ""));

    // For an optimistic UI approach we remove the vote object right away in
    // order for the user to get instant feedback on removing their reaction.
    // Below the removed copy will be added back into the local state again if
    // the backend failed to process our request successfully.
    const lis: VoteSearchResponse[] = vote.filter((x: VoteSearchResponse) => x !== rem);
    setVote([...lis]);

    voteDelete(des, rct).catch(() => {
      // catch adds the removed vote object back into the user's local copy
      // since the backend could not process our request successfully.
      if (rem) {
        setVote([...lis, rem]);
      }
    });
  };

  return (
    <>
      <div className="shadow-gray-400 dark:shadow-black shadow-[0_0_2px]">
        {!props.xpnd && (
          <Description
            radd={radd}
            rrem={rrem}
            desc={props.desc[0]}
            evnt={props.evnt}
            rctn={fltr(user?.uuid || "", [...props.rctn], vote.filter((x) => x.desc === props.desc[0].desc))}
          />
        )}
        {props.xpnd && (
          <>
            {props.desc.map((x, i) => (
              <Description
                key={i}
                radd={radd}
                rrem={rrem}
                desc={x}
                evnt={props.evnt}
                rctn={fltr(user?.uuid || "", [...props.rctn], vote.filter((y) => y.desc === x.desc))}
              />
            ))}
          </>
        )}
        {props.form && (
          <Form
            atkn={props.atkn}
            cncl={props.cncl}
            done={props.addd}
            evnt={props.evnt.evnt()}
          />
        )}
      </div>

      {erro.map((x, i) => (
        <ErrorToast key={i} erro={x} />
      ))}
      {auth.map((x, i) => (
        <LoginToast
          key={i}
          titl="Please login to add your reaction, or the beavers will build a dam."
        />
      ))}
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

