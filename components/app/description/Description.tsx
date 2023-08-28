import React, { useState, MouseEvent } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import ErrorToast from '@/components/app/event/add/ErrorToast'

import ReactionBar from '@/components/app/reaction/ReactionBar'
import ReactionPicker from '@/components/app/reaction/ReactionPicker'

import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response';
import { EventSearchObject } from "@/modules/api/event/search/Object";
import { DescriptionSearchResponse } from '@/modules/api/description/search/Response';
import { VoteCreate } from '@/modules/api/vote/create/Create';
import { VoteDelete } from '@/modules/api/vote/delete/Delete';
import { VoteSearchResponse } from "@/modules/api/vote/search/Response";

function onLinkClick(evn: MouseEvent<HTMLAnchorElement>) {
  evn.stopPropagation();
}

interface Props {
  atkn: string;
  desc: DescriptionSearchResponse;
  evnt: EventSearchObject;
  rctn: ReactionSearchResponse[];
  vote: VoteSearchResponse[];
}

export default function Description(props: Props) {
  const { user } = useUser();

  const [erro, setErro] = useState<Error | null>(null);
  const [rctn, setRctn] = useState<ReactionSearchResponse[]>(props.rctn);
  const [vote, setVote] = useState<VoteSearchResponse[]>(props.vote);

  const voteCreate = async function (x: ReactionSearchResponse): Promise<void> {
    try {
      await VoteCreate([{ atkn: props.atkn, desc: props.desc.desc, rctn: x.rctn }]);
    } catch (err) {
      const vid = vote.find(y => y.rctn === x.rctn)?.vote || "";
      setVote([...vote.filter((y) => y.vote !== vid)]);

      setErro(err as Error);
    }
  };

  const voteDelete = async function (x: ReactionSearchResponse): Promise<void> {
    try {
      const vid = vote.find(y => y.rctn === x.rctn)?.vote || "";
      await VoteDelete([{ atkn: props.atkn, vote: vid }]);
    } catch (err) {
      vote.push({
        // intern
        crtd: "",
        user: user?.uuid || "",
        vote: "",
        // public
        desc: props.desc.desc,
        rctn: x.rctn,
      })

      setVote([...vote])

      setErro(err as Error);
    }
  };

  // badd is called as "on button add" callback, which is the event invoked when
  // the user clicks on a reaction icon in the reaction button component.
  const badd = (x: ReactionSearchResponse) => {
    const ind = rctn.findIndex((y) => y.rctn === x.rctn);

    // If the user clicked on the reaction already, the button is not allowed to
    // have any effect anymore.
    if (rctn[ind].clck) return

    vote.push({
      // intern
      crtd: "",
      user: user?.uuid || "",
      vote: "",
      // public
      desc: props.desc.desc,
      rctn: x.rctn,
    })

    setVote([...vote])

    voteCreate(x);
  };

  // brem is called as "on button remove" callback, which is the event invoked when
  // the user clicks on a reaction icon in the reaction button component.
  const brem = (x: ReactionSearchResponse) => {
    const ind = rctn.findIndex((y) => y.rctn === x.rctn);

    // If the user did not click on the reaction already, the button is not
    // allowed to have any effect at all.
    if (!rctn[ind].clck) return

    const vid = vote.find(y => y.rctn === x.rctn)?.vote || "";
    setVote([...vote.filter((y) => y.vote !== vid)]);

    voteDelete(x);
  };

  // padd is called as "on picker add" callback, which is the event invoked when
  // the user clicks on a reaction icon in the reaction picker component.
  const padd = (x: ReactionSearchResponse) => {
    const ind = rctn.findIndex((y) => y.rctn === x.rctn);

    // If the user clicked on the reaction already, the picker is not allowed to
    // have any effect anymore.
    if (rctn[ind].clck) return

    vote.push({
      // intern
      crtd: "",
      user: user?.uuid || "",
      vote: "",
      // public
      desc: props.desc.desc,
      rctn: x.rctn,
    })

    setVote([...vote])

    voteCreate(x);
  };

  {
    // Create a lookup table to store the vote counts for each reaction.
    const rct: Record<string, number> = {};
    // Create a set to store the reaction IDs clicked by the local user.
    const clc: Set<string> = new Set();

    vote.forEach((x: VoteSearchResponse) => {
      if (rct[x.rctn] === undefined) {
        rct[x.rctn] = 0;
      }
      rct[x.rctn]++;

      if (x.user === (user?.uuid || "")) {
        clc.add(x.rctn);
      }
    });

    rctn.forEach((x: ReactionSearchResponse) => {
      x.amnt = rct[x.rctn] || 0;
      x.clck = clc.has(x.rctn);
    });
  }

  console.log("1", rctn)

  return (
    <div className="bg-gray-50 dark:bg-gray-800 first:border-none border-t-solid border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between">
        <div className="flex-shrink-0 flex flex-row">
          <a
            href={`/user/${props.desc.name}`}
            onClick={onLinkClick}
            className="flex items-center pl-2"
          >
            <img className="w-7 h-7 rounded-full" src={props.desc.imag} alt="profile picture"></img>
          </a>
          <a
            href={`/user/${props.desc.name}`}
            onClick={onLinkClick}
            className="flex items-center pl-2 py-3 text-gray-900 dark:text-gray-50 text-sm font-medium whitespace-nowrap hover:underline"
          >
            {props.desc.name}
          </a>
          {props.desc.user === props.evnt.user() && (
            <label className="relative inline-block flex items-center rounded mx-2 my-3 px-[3px] text-xs font-medium bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400 border border-sky-500 cursor-pointer group">
              EC
              <div className="absolute top-[-50%] left-[105%] ml-2 z-10 whitespace-nowrap invisible group-hover:visible px-3 py-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900">
                Event Creator
              </div>
            </label>
          )}
        </div>

        <div className="flex-grow relative overflow-x-auto">
          <ReactionBar badd={badd} brem={brem} rctn={rctn} />
        </div>

        <div>
          <ReactionPicker rctn={rctn} clmn={6} padd={padd} />
        </div>
      </div>

      <p className="px-2 pb-2 text-sm text-gray-900 dark:text-gray-50">
        {props.desc.text}
      </p>

      {erro && (
        <ErrorToast error={erro} />
      )}
    </div>
  );
};
