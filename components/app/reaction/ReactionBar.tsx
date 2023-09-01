import ReactionButton from '@/components/app/reaction/ReactionButton'

import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response';

interface ReactionBarProps {
  radd: (rctn: ReactionSearchResponse) => void;
  rrem: (rctn: ReactionSearchResponse) => void;
  rctn: ReactionSearchResponse[];
}

export default function ReactionBar(props: ReactionBarProps) {
  return (
    <ul className="flex flex-row absolute right-0">
      {props.rctn.filter((x) => x.amnt !== 0).map((y) => (
        <ReactionButton key={y.rctn} radd={props.radd} rrem={props.rrem} rctn={y} />
      ))}
    </ul>
  );
};
