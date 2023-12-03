import { GiSevenPointedStar } from "react-icons/gi";

import { hasPrm } from "@/components/app/cache/CacheProvider";

interface Props {
  bool?: boolean;
  name: string;
  prem?: string;
}

export const PremiumButton = (props: Props) => {
  return (
    <div className="flex">
      {props.name}
      {(props.bool === true || hasPrm(props.prem || "", Date.now() / 1000)) && (
        <GiSevenPointedStar className="flex w-3 h-3 ml-1 text-sky-500 font-medium" />
      )}
    </div>
  );
};
