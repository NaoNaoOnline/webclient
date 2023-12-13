import { ReactNode } from "react";

import spacetime from "spacetime";

import { RiCheckLine } from "react-icons/ri";
import { RiLoopRightLine } from "react-icons/ri";

import { RowGrid } from "@/components/app/layout/RowGrid";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { SubscriptionSearchResponse } from "@/modules/api/subscription/search/Response";
import { SubscriptionButtonUpdate } from "./button/SubscriptionButtonUpdate";

interface Props {
  pntr: string;
  subs: SubscriptionSearchResponse[];
  updt: () => void;
}

export const SubscriptionOverview = (props: Props) => {
  return (
    <>
      {props.subs?.map((x, i) => (
        <RowGrid
          key={i}
          list={true}
          subj={
            <div className="flex w-full">
              <div
                className="flex-1 basis-2/4 mr-6 md:mr-3"
              >
                {spacetime(Number(x.unix) * 1000, "GMT").format("month")}
              </div>
              <div
                className="flex flex-1 basis-2/4 items-center"
              >
                <Tooltip
                  desc={tipDes(x)}
                  side="right"
                >
                  <label
                    className="hover:underline hover:decoration-dashed cursor-pointer"
                  >
                    {x.stts}
                  </label>
                </Tooltip>
              </div>
            </div>
          }
          midl={
            <div >
              0.003 ETH
            </div>
          }
          rigt={
            <SubscriptionButtonUpdate
              bttn={x.stts === "created"}
              clck={props.updt}
              dsbl={props.pntr !== ""}
              spin={props.pntr !== ""}
            />
          }
        />
      ))}
    </>
  )
};

const tipDes = (sub: SubscriptionSearchResponse): ReactNode => {
  if (sub.stts === "created") {
    return (
      <div>
        <div>the subscription got created</div>
        <div>and is still being verified</div>
      </div>
    );
  }

  if (sub.stts === "success") {
    return (
      <div>
        <div>the subscription got verified</div>
        <div>and is active until its expiry</div>
      </div>
    );
  }

  if (sub.stts === "failure") {
    return (
      <div>
        {sub.fail}
      </div>
    );
  }

  return "";
};