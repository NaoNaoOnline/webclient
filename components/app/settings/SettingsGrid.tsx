import { ReactElement, cloneElement } from "react";

interface Props {
  icon?: ReactElement;
  link?: ReactElement;
  subj?: ReactElement;
  midl?: ReactElement;
  rigt?: ReactElement;
}

export const SettingsGrid = (props: Props) => {
  return (
    <div className="flex flex-row p-3 text-gray-900 dark:text-gray-50 items-center">
      <div className="flex flex-1 basis-2/3">
        <div className="flex w-5 my-auto">
          {props.icon && cloneElement(props.icon, {
            className: `
              w-5 h-5 text-gray-400 dark:text-gray-500 ${props.icon.props.className || ""}
            `,
          })}
          {props.link && cloneElement(props.link, {})}
        </div>

        <div className="flex w-full ml-3 whitespace-nowrap">
          {props.subj && cloneElement(props.subj, {
            className: `
              text-gray-400 dark:text-gray-500 ${props.subj.props.className || ""}
            `,
          })}
        </div>
      </div>

      {props.midl && (
        <div className="flex-1 basis-1/3">
          {cloneElement(props.midl, {
            className: `
              text-gray-400 dark:text-gray-500 ${props.midl.props.className || ""}
            `,
          })}
        </div>
      )}

      <div className="flex justify-end">
        {props.rigt && cloneElement(props.rigt, {
          className: `
            text-gray-400 dark:text-gray-500 ${props.rigt.props.className || ""}
          `,
        })}
      </div>
    </div>
  );
};
