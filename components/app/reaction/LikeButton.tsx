import { HeartIcon } from "@heroicons/react/24/outline";

interface ReactionButtonProps {
  amnt: number;                 // can update
  cupd: boolean;                // can update
  radd: (use: boolean) => void; // callback for adding a reaction
  rrem: (use: boolean) => void; // callback for removing a reaction
  user: boolean;                // whether the current user clicked the button
}

export default function ReactionButton(props: ReactionButtonProps) {
  const onClck = () => {
    if (!props.cupd) return;

    if (props.user) {
      props.rrem(props.user)
    } else {
      props.radd(props.user)
    }
  };

  return (
    <li className="flex flex-row min-w-[70px] items-center">
      <button
        onClick={onClck}
        className={`${!props.cupd ? "cursor-default" : ""}  p-2 py-3`}
        type="button"
      >
        <HeartIcon
          className={`
            text-lg w-5 h-5 text-gray-400 dark:text-gray-500
            ${props.cupd && props.user ? " fill-red-500 text-red-500  dark:text-red-500 " : ""}
            ${props.cupd && !props.user ? "             text-gray-400 dark:text-gray-500" : ""}
            ${!props.cupd && props.user ? "fill-gray-400 dark:fill-gray-500" : ""}
          `}
        />
      </button>
      <div className="text-xs text-gray-400 dark:text-gray-500">
        {fmtNum(props.amnt)}
      </div>
    </li>
  );
}

function fmtNum(num: number, pre: number = 2) {
  if (num == 0) return "0";

  const stp = 1000;
  const fmt = ["", "K", "M", "B", "T"];
  const ind = Math.floor(Math.log(num) / Math.log(stp));

  return parseFloat((num / Math.pow(stp, ind)).toFixed(pre)) + " " + fmt[ind];
}
