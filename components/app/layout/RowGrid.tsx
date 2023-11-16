import { ReactElement, cloneElement } from "react";

interface Props {
  list?: boolean;
  icon?: ReactElement;
  link?: ReactElement;
  subj?: ReactElement;
  midl?: ReactElement;
  rigt?: ReactElement;
}

export const RowGrid = (props: Props) => {
  return (
    <div
      className={`
        flex flex-row p-3 items-center group/RowGrid
        ${props.list ? "odd:bg-gray-200/30 odd:dark:bg-gray-800/30" : ""}
        text-gray-900 dark:text-gray-50
      `}
    >
      <div
        className={`
          flex flex-1
          ${props.midl ? "basis-2/4 max-w-[60%]" : ""}
          ${!props.midl && props.rigt ? "basis-3/4" : ""}
          ${!props.midl && !props.rigt ? "basis-4/4" : ""}
        `}
      >
        <div className="flex w-5 my-auto">
          {props.icon && cloneElement(props.icon, {
            className: `
              w-5 h-5 text-gray-500 dark:text-gray-500 ${props.icon.props.className || ""}
            `,
          })}
          {props.link && cloneElement(props.link, {})}
        </div>

        <div className="flex w-full ml-3">
          {props.subj && cloneElement(props.subj, {
            className: `
              text-gray-500 dark:text-gray-500 ${props.subj.props.className || ""}
            `,
          })}
        </div>
      </div>

      {props.midl && (
        <div className="flex flex-1 basis-1/4">
          {cloneElement(props.midl, {
            className: `
              text-gray-500 dark:text-gray-500 ${props.midl.props.className || ""}
            `,
          })}
        </div>
      )}

      <div className="flex justify-end">
        {props.rigt && cloneElement(props.rigt, {
          className: `
            text-gray-500 dark:text-gray-500 ${props.rigt.props.className || ""}
          `,
        })}
      </div>
    </div>
  );
};
