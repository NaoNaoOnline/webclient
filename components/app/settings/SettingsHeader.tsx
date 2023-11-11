import { ReactElement, cloneElement } from "react";

interface Props {
  bttn?: ReactElement;
  icon?: ReactElement;
  link?: ReactElement;
  titl: string;
}

export const SettingsHeader = (props: Props) => {
  return (
    <div className="flex flex-row p-3 text-gray-900 dark:text-gray-50 items-center">
      <div className="flex flex-1">

        <div className="flex my-auto">
          {props.icon && cloneElement(props.icon, {
            className: `
              w-5 h-5 text-gray-400 dark:text-gray-400
            `,
          })}
          {props.link && cloneElement(props.link, {})}
        </div>

        <div className="flex-1 ml-3 whitespace-nowrap">
          {props.titl}
        </div>
      </div>

      <div className="flex justify-end">
        {props.bttn && cloneElement(props.bttn, {})}
      </div>
    </div>
  );
};
