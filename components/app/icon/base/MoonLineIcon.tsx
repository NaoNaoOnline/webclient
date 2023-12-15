import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const MoonLineIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
      strokeWidth="1.5"
    >
      <g>
        <path stroke="currentColor" stroke-linejoin="round" d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
        <path d="M0 0h24v24H0z" />
      </g>
    </BaseIcon>
  );
};
