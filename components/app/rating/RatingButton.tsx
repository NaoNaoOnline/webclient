import React, { useEffect, useState } from 'react';

interface RatingButtonProps {
  amnt: number;
  clck: boolean;
  hndl: (amnt: number, name: string) => void;
  html: string;
  name: string;
}

export default function RatingButton(props: RatingButtonProps) {
  const [amnt, setAmnt] = useState(props.amnt);
  const [clck, setClck] = useState(props.clck);

  const onClck = () => {
    if (clck) {
      setAmnt(amnt - 1);
      setClck(false);
      props.hndl(amnt - 1, props.name)
    } else {
      setAmnt(amnt + 1);
      setClck(true);
      props.hndl(amnt + 1, props.name)
    }
  };

  useEffect(() => {
    setAmnt(props.amnt);
  }, [props.amnt]);

  if (amnt === 0) return <></>;

  return (
    <li>
      <button
        onClick={onClck}
        className="flex flex-row p-2 py-3 group"
        type="button"
      >
        <div className="w-5 h-5 text-lg">{props.html}</div>
        <div className={`text-xs ${clck ? 'text-gray-900 dark:text-gray-50' : 'text-gray-400'} group-hover:text-gray-900 dark:group-hover:text-gray-50`}>{amnt}</div>
      </button>
    </li>
  );
}
