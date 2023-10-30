import LikeButton from "@/components/app/reaction/LikeButton";

interface ReactionBarProps {
  amnt: number;                 // can update
  cupd: boolean;                // can update
  radd: (use: boolean) => void; // callback for adding a reaction
  rrem: (use: boolean) => void; // callback for removing a reaction
  user: boolean;                // whether the current user clicked the button
}

export default function ReactionBar(props: ReactionBarProps) {
  return (
    <ul className="flex flex-row absolute right-0">
      <LikeButton
        amnt={props.amnt}
        cupd={props.cupd}
        radd={props.radd}
        rrem={props.rrem}
        user={props.user}
      />
    </ul>
  );
};
