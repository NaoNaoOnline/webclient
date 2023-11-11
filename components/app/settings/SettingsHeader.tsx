import { ReactElement } from "react";

import { SettingsGrid } from "@/components/app/settings/SettingsGrid";

interface Props {
  bttn?: ReactElement;
  icon?: ReactElement;
  link?: ReactElement;
  titl: string;
}

export const SettingsHeader = (props: Props) => {
  return (
    <SettingsGrid
      icon={props.icon}
      link={props.link}
      subj={
        <>
          {props.titl}
        </>
      }
      rigt={props.bttn}
    />
  );
};
