import React, { useState } from 'react';

import RatingButton from '@/components/app/rating/RatingButton'

import { RatingSearchResponse } from '@/modules/api/rating/search/Response';

interface RatingBarProps {
  hndl: (amnt: number, name: string) => void;
  list: RatingSearchResponse[];
}

export default function RatingBar(props: RatingBarProps) {
  return (
    <>
      <ul className="flex flex-row absolute right-0">
        {props.list.map((c, i) => (
          <RatingButton key={c.name} amnt={c.amnt} clck={c.clck} hndl={props.hndl} html={c.html} name={c.name} />
        ))}
      </ul>
    </>
  );
};
