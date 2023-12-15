import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const MenuAddLineIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
    >
      <g>
        <path fill="currentColor" d="M18 15L17.999 18H21V20H17.999L18 23H16L15.999 20H13V18H15.999L16 15H18ZM11 18V20H3V18H11ZM21 11V13H3V11H21ZM21 4V6H3V4H21Z" />
      </g>
    </BaseIcon>
  );
};
