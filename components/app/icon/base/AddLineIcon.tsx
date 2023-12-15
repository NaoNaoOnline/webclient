import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const AddLineIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
    >
      <g>
        <path fill="currentColor" d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" />
      </g>
    </BaseIcon>
  );
};
