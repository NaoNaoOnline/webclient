import React from 'react';

import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response';

interface ReactionButtonProps {
  badd: (rctn: ReactionSearchResponse) => void;
  brem: (rctn: ReactionSearchResponse) => void;
  rctn: ReactionSearchResponse;
}

export default function ReactionButton(props: ReactionButtonProps) {
  const onClck = () => {
    if (props.rctn.clck) {
      props.brem(props.rctn)
    } else {
      props.badd(props.rctn)
    }
  };

  return (
    <li>
      <button
        onClick={onClck}
        className="flex flex-row p-2 py-3 group"
        type="button"
      >
        <div className="w-5 h-5 text-lg">{props.rctn.html}</div>
        <div className={`text-xs ${props.rctn.clck ? 'text-gray-900 dark:text-gray-50' : 'text-gray-400 dark:text-gray-500'} group-hover:text-gray-900 dark:group-hover:text-gray-50`}>{props.rctn.amnt}</div>
      </button>
    </li>
  );
}
