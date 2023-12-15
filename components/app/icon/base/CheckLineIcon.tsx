import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const CheckLineIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
    >
      <g>
        <path fill="currentColor" d="M10.0007 15.1709L19.1931 5.97852L20.6073 7.39273L10.0007 17.9993L3.63672 11.6354L5.05093 10.2212L10.0007 15.1709Z" />
      </g>
    </BaseIcon>
  );
};
