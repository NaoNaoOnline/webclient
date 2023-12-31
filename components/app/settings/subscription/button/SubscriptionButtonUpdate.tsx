import { useEffect, useState } from "react";

import { CheckLineIcon } from "@/components/app/icon/base/CheckLineIcon";
import { LoopLineIcon } from "@/components/app/icon/base/LoopLineIcon";

interface Props {
  bttn: boolean;
  clck: () => void;
  dsbl: boolean;
  spin: boolean;
}

export const SubscriptionButtonUpdate = (props: Props) => {
  const [chck, setChck] = useState<boolean>(false);
  const [time, setTime] = useState<NodeJS.Timeout[]>([]);

  useEffect(() => {
    if (props.bttn || chck) return;

    time.forEach((x: NodeJS.Timeout) => clearTimeout(x));

    const tref = setTimeout(() => {
      setChck(false);
    }, 3 * 1000); // 3 seconds

    setChck(true);
    setTime([tref]);
  }, [props.bttn, chck, time]);

  return (
    <>
      {props.bttn && (
        <button
          onClick={props.clck}
          disabled={props.dsbl}
          className="outline-none group"
          type="button"
        >
          <LoopLineIcon
            className={`
              w-5 h-5 text-gray-500 dark:text-gray-500
              group-hover:text-gray-900 dark:group-hover:text-gray-50
              ${props.spin ? "spin-slow" : ""}
            `}
          />
        </button>
      )}
      {!props.bttn && chck && (
        <CheckLineIcon className="w-5 h-5 text-green-400" />
      )}
    </>
  );
};
