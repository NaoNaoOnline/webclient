import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const LogOutIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
      strokeWidth="2"
    >
      <g>
        <path stroke="currentColor" stroke-linecap="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" points="16 17 21 12 16 7" />
        <line stroke="currentColor" stroke-linecap="round" x1="21" y1="12" x2="9" y2="12" />
      </g>
    </BaseIcon>
  );
};
