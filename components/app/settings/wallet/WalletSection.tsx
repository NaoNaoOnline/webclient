import { useState } from "react";

import { useAccount } from "wagmi";

import { BiInfoCircle } from "react-icons/bi";
import { FaEthereum } from "react-icons/fa";

import { useCache } from "@/components/app/cache/CacheProvider";
import { WalletButtonConnect } from "@/components/app/settings/wallet/button/WalletButtonConnect";
import { WalletButtonVerify } from "@/components/app/settings/wallet/button/WalletButtonVerify";
import WalletCreateForm from "@/components/app/settings/wallet/create/WalletCreateForm";
import { WalletOverview } from "@/components/app/settings/wallet/WalletOverview";
import { SettingsHeader } from "@/components/app/settings/SettingsHeader";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";

export const WalletSection = () => {
  const { address, isConnected, isDisconnected } = useAccount();

  const { wllt, updWllt } = useCache();

  const [crea, setCrea] = useState<boolean>(false);

  return (
    <>
      <SettingsHeader
        icon={<FaEthereum />}
        titl="My Wallets"
        bttn={
          <>
            <Tooltip
              desc={
                <div>
                  use <b>verify</b> to add new wallets or to validate your ownership again
                </div>
              }
              side="left"
            >
              <BiInfoCircle
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
              />
            </Tooltip>

            <WalletButtonVerify
              clck={() => {
                setCrea(true);
              }}
              dsbl={!isConnected || crea}
            />

            <WalletButtonConnect
              dsbl={wllt && wllt.length >= 5 ? true : false}
            />
          </>
        }
      />

      <WalletOverview />

      <WalletCreateForm
        addr={String(address)}
        actv={crea}
        done={(wal: WalletSearchResponse) => {
          setCrea(false);
          // We update the given wallet with itself, since the update
          // removes by wallet ID, replacing the same object with, e.g. an
          // updated timestamp should not be a problem.
          updWllt(wal, wal);
        }}
        fail={() => {
          setCrea(false);
        }}
        wllt={wllt}
      />
    </>
  );
};
