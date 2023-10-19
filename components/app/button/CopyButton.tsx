import { useState } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";

import { CheckIcon } from "@heroicons/react/24/outline";

interface Props {
  copy: string;
  text: string;
  className?: string;
}

export default function CopyButton(props: Props) {
  const [chck, setChck] = useState<boolean>(false);
  const [time, setTime] = useState<NodeJS.Timeout[]>([]);

  const shwChck = () => {
    time.forEach((timeout) => clearTimeout(timeout));

    const tref = setTimeout(() => {
      setChck(false);
    }, 3 * 1000); // 3 seconds

    setChck(true);
    setTime([tref]);
  };

  return (
    <div className="flex">
      <CopyToClipboard onCopy={() => shwChck()} text={props.copy} >
        <button className={`flex-1 text-left ${props.className}`}>
          {props.text}
        </button>
      </CopyToClipboard>

      {chck && (
        <span className="flex-1 ml-1 text-green-400">
          <CheckIcon className="w-5 h-5" />
        </span>
      )}
    </div>
  );
};
