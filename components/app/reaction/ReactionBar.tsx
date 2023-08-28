import React from 'react';

import ReactionButton from '@/components/app/reaction/ReactionButton'

import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response';

interface ReactionBarProps {
  badd: (rctn: ReactionSearchResponse) => void;
  brem: (rctn: ReactionSearchResponse) => void;
  rctn: ReactionSearchResponse[];
}

export default function ReactionBar(props: ReactionBarProps) {
  return (
    <ul className="flex flex-row absolute right-0">
      {props.rctn.filter((c) => c.amnt !== 0).map((c) => (
        <ReactionButton key={c.rctn} badd={props.badd} brem={props.brem} rctn={c} />
      ))}
    </ul>
  );
};
