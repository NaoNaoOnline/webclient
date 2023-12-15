import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const EllipsisHorizontalIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
      strokeWidth="1.5"
    >
      <g>
        <path fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </g>
    </BaseIcon>
  );
};
