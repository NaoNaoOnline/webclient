import { RiHeart3Fill } from "react-icons/ri";
import { RiHeart3Line } from "react-icons/ri";

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
    <li className="flex flex-row items-center">
      {props.amnt !== 0 && (
        <div className="text-xs text-gray-400 dark:text-gray-500">
          {fmtNum(props.amnt)}
        </div>
      )}
      <button
        onClick={onClck}
        className={`${!props.cupd ? "cursor-default" : ""} p-3`}
        type="button"
      >
        {props.user && (
          <RiHeart3Fill
            className={`
            w-5 h-5
            ${props.cupd && props.user ? "  text-red-500  dark:text-red-500 " : ""}
            ${props.cupd && !props.user ? " text-gray-400 dark:text-gray-500" : ""}
            ${!props.cupd && props.user ? " text-gray-200 dark:text-gray-700" : ""}
            ${!props.cupd && !props.user ? "text-gray-200 dark:text-gray-700" : ""}
          `}
          />
        )}
        {!props.user && (
          <RiHeart3Line
            className={`
            w-5 h-5
            ${props.cupd && props.user ? "  text-red-500  dark:text-red-500 " : ""}
            ${props.cupd && !props.user ? " text-gray-400 dark:text-gray-500" : ""}
            ${!props.cupd && props.user ? " text-gray-200 dark:text-gray-700" : ""}
            ${!props.cupd && !props.user ? "text-gray-200 dark:text-gray-700" : ""}
          `}
          />
        )}
      </button>
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
