import { ReactElement } from "react";

import { RowGrid } from "@/components/app/layout/RowGrid";

interface Props {
  bttn?: ReactElement;
  icon?: ReactElement;
  link?: ReactElement;
  titl: string;
}

export const ListHeader = (props: Props) => {
  return (
    <RowGrid
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
