import React from 'react';

import RatingButton from '@/components/app/rating/RatingButton'

import { RatingSearchResponse } from '@/modules/api/rating/search/Response';

interface RatingBarProps {
  hndl: (amnt: number, name: string) => void;
  rtng: RatingSearchResponse[];
}

export default function RatingBar(props: RatingBarProps) {
  return (
    <>
      <ul className="flex flex-row absolute right-0">
        {props.rtng.map((c, i) => (
          <RatingButton key={c.name} amnt={c.amnt} clck={c.clck} hndl={props.hndl} html={c.html} name={c.name} />
        ))}
      </ul>
    </>
  );
};
