import { useState } from "react";

import spacetime from "spacetime";
import { useAccount } from "wagmi";

import { BiInfoCircle } from "react-icons/bi";
import { FaEthereum } from "react-icons/fa";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { CopyButton } from "@/components/app/button/CopyButton";
import { useCache } from "@/components/app/cache/CacheProvider";
import { WalletButtonConnect } from "@/components/app/settings/wallet/button/WalletButtonConnect";
import { WalletButtonVerify } from "@/components/app/settings/wallet/button/WalletButtonVerify";
import WalletCreateForm from "@/components/app/settings/wallet/create/WalletCreateForm";
import WalletMenu from "@/components/app/settings/wallet/WalletMenu";
import { SettingsHeader } from "@/components/app/settings/SettingsHeader";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { WalletDelete } from "@/modules/api/wallet/delete/Delete";
import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";
import { truncateEthAddress } from "@/modules/wallet/Address";

export const WalletSection = () => {
  const { address, isConnected } = useAccount();

  const { wllt, remWllt, updWllt } = useCache();
  const { addErro, addPgrs, addScss } = useToast();
  const { atkn } = useAuth();

  const [crea, setCrea] = useState<boolean>(false);

  const pgrs: ProgressPropsObject = new ProgressPropsObject("Removing Wallet");
  const scss: SuccessPropsObject = new SuccessPropsObject("We trashed it Pinky, that wallet's dust!");

  const walletDelete = async (wal: WalletSearchResponse) => {
    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [del] = await WalletDelete([{ atkn: atkn, wllt: wal.intern.wllt }]);

      pgrs.setDone(() => {
        remWllt(wal);
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      addErro(new ErrorPropsObject("Outrage, and the beavers are plundering again out of town!", err as Error));
      setCrea(false);
    }
  };

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
                className="w-5 h-5 text-gray-500 dark:text-gray-500"
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

      {wllt?.map((x, i) => (
        <ul key={i} className="flex flex-row w-full">
          <li className={`flex items-center pl-3 py-3 rounded-lg ${x.public.addr === String(address) ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
            <span className="w-[20px] text-center text-sm font-mono"></span>
          </li>

          <li className={`flex items-center p-3 rounded-lg ${x.public.addr === String(address) ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
            <span className="flex-1 w-[127px]">
              <CopyButton
                className="text-sm font-mono underline underline-offset-2 decoration-dashed"
                copy={x.public.addr}
                text={truncateEthAddress(x.public.addr)}
              />
            </span>
          </li>

          <li className={`flex items-center py-3 rounded-lg ${x.public.addr === String(address) ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
            <span className="w-[20px] text-center text-sm font-mono"></span>
          </li>

          <li className={`flex items-center p-3 rounded-lg ${x.public.addr === String(address) ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
            <span className="flex-1 w-[140px] text-right text-sm font-mono">{spacetime.now().since(spacetime(Number(x.intern.addr.time) * 1000, "GMT")).rounded}</span>
          </li>

          <li className={`flex relative w-full items-center p-3 ${x.public.addr === String(address) ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
            <div className="flex-shrink-0 absolute right-0 mr-3">
              <WalletMenu
                wrem={() => walletDelete(x)}
              />
            </div>
          </li>
        </ul>
      ))}

      <WalletCreateForm
        actv={crea}
        cncl={() => {
          setCrea(false);
        }}
        done={(wal: WalletSearchResponse) => {
          // We update the given wallet with itself, since the update
          // removes by wallet ID, replacing the same object with, e.g. an
          // updated timestamp should not be a problem.
          updWllt(wal, wal);
          setCrea(false);
        }}

        wllt={wllt}
      />
    </>
  );
};
