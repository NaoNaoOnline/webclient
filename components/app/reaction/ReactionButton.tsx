import { ReactionSearchResponse } from "@/modules/api/reaction/search/Response";

interface ReactionButtonProps {
  updt: boolean;
  radd: (rctn: ReactionSearchResponse) => void;
  rrem: (rctn: ReactionSearchResponse) => void;
  rctn: ReactionSearchResponse;
}

export default function ReactionButton(props: ReactionButtonProps) {
  const onClck = () => {
    if (!props.updt) return;

    if (props.rctn.clck) {
      props.rrem(props.rctn)
    } else {
      props.radd(props.rctn)
    }
  };

  return (
    <li>
      <button
        onClick={onClck}
        className={`flex flex-row ${!props.updt ? "opacity-50 cursor-default" : ""}  p-2 py-3 group`}
        type="button"
      >
        <div className="w-5 h-5 text-lg">
          {props.rctn.html}
        </div>
        <div className={`text-xs ${props.rctn.clck ? "text-gray-900 dark:text-gray-50" : "text-gray-400 dark:text-gray-500"} ${props.updt ? "group-hover:text-gray-900 dark:group-hover:text-gray-50" : ""}`}>
          {props.rctn.amnt}
        </div>
      </button>
    </li>
  );
}
