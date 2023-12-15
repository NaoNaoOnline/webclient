import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const DotFullFillIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
    >
      <g>
        <circle cx="12" cy="12" r="6" />
      </g>
    </BaseIcon>
  );
};
