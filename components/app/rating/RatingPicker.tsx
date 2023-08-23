import React from 'react';

import * as Popover from '@radix-ui/react-popover';

import { FaceSmileIcon } from '@heroicons/react/24/outline'

import { RatingSearchResponse } from '@/modules/api/rating/search/Response';

interface RatingPickerProps {
  ratings: RatingSearchResponse[];
  onClick: (name: RatingSearchResponse) => void;
  columns: number;
}

export default function RatingPicker(props: RatingPickerProps) {
  // Group emojis into rows with the specified number of columns.
  const row: RatingSearchResponse[][] = [];
  for (let i = 0; i < props.ratings.length; i += props.columns) {
    row.push(props.ratings.slice(i, i + props.columns));
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="py-3 outline-none group" type="button">
          <FaceSmileIcon className="w-5 h-5 mx-2 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="rounded p-5 w-fill bg-gray-50 dark:bg-gray-700 shadow-gray-400 dark:shadow-black shadow-[0_0_2px] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
        >

          {row.map((r, i) => (
            <ul key={i} className="flex flex-row gap-2.5">
              {r.map((c, j) => (
                <li key={j} className="flex rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 items-center">
                  <button
                    onClick={() => props.onClick(c)}
                    className="p-2"
                    type="button"
                  >
                    <div className="w-5 h-5">{c.html}</div>
                  </button>
                </li>
              ))}
            </ul>
          ))}

        </Popover.Content>
      </Popover.Portal >
    </Popover.Root >
  );
};
