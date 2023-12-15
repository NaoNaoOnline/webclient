import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const EthereumIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
      viewBox="0 0 320 512"
    >
      <g>
        <path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
      </g>
    </BaseIcon>
  );
};
