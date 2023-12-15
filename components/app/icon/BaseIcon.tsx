import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  strokeWidth?: string;
  viewBox?: string;
}

export const BaseIcon = (props: Props) => {
  return (
    <svg
      className={"w-5 h-5 " + props.className}
      fill="none"
      onClick={props.onClick}
      strokeWidth={props.strokeWidth ? props.strokeWidth : "1"}
      viewBox={props.viewBox ? props.viewBox : "0 0 24 24"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {props.children}
    </svg>
  );
};
