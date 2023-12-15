import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
  onClick?: () => void;
}

export const RadioOffIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
      onClick={props.onClick}
    >
      <g>
        <path fill="currentColor" d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
      </g>
    </BaseIcon>
  );
};
