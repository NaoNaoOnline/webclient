import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const LogInIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
      strokeWidth="2"
    >
      <g>
        <path stroke="currentColor" stroke-linecap="round" d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" points="10 17 15 12 10 7" />
        <line stroke="currentColor" stroke-linecap="round" x1="15" y1="12" x2="3" y2="12" />
      </g>
    </BaseIcon>
  );
};
