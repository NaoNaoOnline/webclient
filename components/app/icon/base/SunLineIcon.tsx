import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const SunLineIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
      strokeWidth="2"
    >
      <g strokeLinecap="round">
        <path stroke="currentColor" d="M14.828 14.828a4 4 0 1 0 -5.656 -5.656a4 4 0 0 0 5.656 5.656z" />
        <path stroke="currentColor" d="M6.343 17.657l-1.414 1.414" />
        <path stroke="currentColor" d="M6.343 6.343l-1.414 -1.414" />
        <path stroke="currentColor" d="M17.657 6.343l1.414 -1.414" />
        <path stroke="currentColor" d="M17.657 17.657l1.414 1.414" />
        <path stroke="currentColor" d="M4 12h-2" />
        <path stroke="currentColor" d="M12 4v-2" />
        <path stroke="currentColor" d="M20 12h2" />
        <path stroke="currentColor" d="M12 20v2" />
        <path d="M0 0h24v24H0z" />
      </g>
    </BaseIcon>
  );
};
