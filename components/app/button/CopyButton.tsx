import { ReactElement, cloneElement, useState } from "react";

import { CopyToClipboard } from "react-copy-to-clipboard";

import { CheckLineIcon } from "@/components/app/icon/base/CheckLineIcon";

interface Props {
  className?: string;
  copy: string;
  icon?: ReactElement;
  text?: string;
}

export const CopyButton = (props: Props) => {
  const [chck, setChck] = useState<boolean>(false);
  const [time, setTime] = useState<NodeJS.Timeout[]>([]);

  const shwChck = () => {
    time.forEach((x: NodeJS.Timeout) => clearTimeout(x));

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
          {props.text ? props.text : ""}
          {props.icon && !chck && cloneElement(props.icon)}
          {props.icon && chck && (
            <span className="text-green-400">
              <CheckLineIcon className="w-5 h-5" />
            </span>
          )}
        </button>
      </CopyToClipboard>

      {props.text && chck && (
        <span className="flex-1 ml-1 text-green-400">
          <CheckLineIcon className="w-5 h-5" />
        </span>
      )}
    </div >
  );
};
