import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const DotHalfFillIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
    >
      <g>
        <path fill="currentColor" d="M12 2h-1v20h1a10 10 0 0 0 0-20z" />
      </g>
    </BaseIcon>
  );
};
