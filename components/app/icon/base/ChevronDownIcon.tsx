import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const ChevronDownIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
      strokeWidth="2"
    >
      <g>
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </g>
    </BaseIcon>
  );
};
