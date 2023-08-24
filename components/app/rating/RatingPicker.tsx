import React from 'react';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'

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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="py-3 outline-none group" type="button">
          <EllipsisHorizontalIcon className="w-5 h-5 mx-2 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-gray-50 dark:bg-gray-700 rounded-md p-[5px] shadow-gray-400 dark:shadow-black shadow-[0_0_2px] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          loop
        >


          {row.map((r, i) => (
            <DropdownMenu.Group key={i} className="flex flex-row gap-2.5">
              {r.map((c, j) => (
                <DropdownMenu.Item
                  key={j}
                  onClick={() => props.onClick(c)}
                  onSelect={(e) => e.preventDefault()}
                  className="flex w-9 h-9 text-lg text-gray-900 dark:text-gray-50 rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-white cursor-pointer"
                >
                  {c.html}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Group>
          ))}

          <DropdownMenu.Separator className="h-[1px] bg-gray-200 dark:bg-gray-800 my-[5px]" />

          <DropdownMenu.Item className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-white cursor-pointer">
            Follow User
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-[1px] bg-gray-200 dark:bg-gray-800 my-[5px]" />

          <DropdownMenu.Item disabled className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-white cursor-pointer">
            Update Description
          </DropdownMenu.Item>
          <DropdownMenu.Item className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-white cursor-pointer">
            Report Description
          </DropdownMenu.Item>
          <DropdownMenu.Item className="text-red-600 dark:text-red-600 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-red-600 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-red-600 cursor-pointer">
            Delete Description
          </DropdownMenu.Item>


        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
