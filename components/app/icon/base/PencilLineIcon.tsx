import { BaseIcon } from "@/components/app/icon/BaseIcon";

interface Props {
  className?: string;
}

export const PencilLineIcon = (props: Props) => {
  return (
    <BaseIcon
      className={props.className}
      strokeWidth="1.5"
    >
      <g>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </g>
    </BaseIcon>
  );
};
