import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const BarsLeftIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
      strokeWidth="2"
    >
      <g>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
      </g>
    </BaseIcon>
  );
};
