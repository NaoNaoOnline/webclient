import { useState } from "react";

import { useAccount } from "wagmi";

import { BiInfoCircle } from "react-icons/bi";
import { BsCurrencyDollar } from "react-icons/bs";

import { useCache } from "@/components/app/cache/CacheProvider";
import { SubscriptionButtonSubscribe } from "@/components/app/settings/subscription/button/SubscriptionButtonSubscribe";
import { ListHeader } from "@/components/app/layout/ListHeader";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

export const SubscriptionSection = () => {
  const { wllt, updWllt } = useCache();

  const [crea, setCrea] = useState<boolean>(false);

  return (
    <>
      <ListHeader
        icon={<BsCurrencyDollar />}
        titl="My Subscription"
        bttn={
          <>
            <Tooltip
              desc={
                <div>
                  <div>
                    connect your ETH wallet and
                  </div>
                  <div>
                    enable all premium features
                  </div>
                </div>
              }
              side="left"
            >
              <BiInfoCircle
                className="w-5 h-5 text-gray-500 dark:text-gray-500"
              />
            </Tooltip>

            <SubscriptionButtonSubscribe
              clck={() => {
                setCrea(true);
              }}
              dsbl={false}
            />
          </>
        }
      />
    </>
  );
};
