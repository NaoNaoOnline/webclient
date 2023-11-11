import spacetime from "spacetime";
import { useAccount, useDisconnect } from "wagmi";

import { GoDotFill } from "react-icons/go";
import { RiDeleteBinLine } from "react-icons/ri";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { CopyButton } from "@/components/app/button/CopyButton";
import { useCache } from "@/components/app/cache/CacheProvider";
import { SettingsGrid } from "@/components/app/settings/SettingsGrid";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { WalletDelete } from "@/modules/api/wallet/delete/Delete";
import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";
import { truncateEthAddress } from "@/modules/wallet/Address";

export const WalletOverview = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { wllt, remWllt } = useCache();
  const { addErro, addPgrs, addScss } = useToast();
  const { atkn } = useAuth();

  const walletDelete = async (wal: WalletSearchResponse) => {
    const pgrs: ProgressPropsObject = new ProgressPropsObject("Removing Wallet");
    const scss: SuccessPropsObject = new SuccessPropsObject("We trashed it Pinky, that wallet's dust!");

    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [del] = await WalletDelete([{ atkn: atkn, wllt: wal.intern.wllt }]);

      if (wal.public.addr === String(address)) {
        disconnect();
      }

      addScss(scss);
      pgrs.setDone(() => {
        remWllt(wal);
      });
    } catch (err) {
      addErro(new ErrorPropsObject("Outrage, and the beavers are plundering again out of town!", err as Error));
    }
  };

  return (
    <>
      {wllt?.map((x, i) => (
        <SettingsGrid
          key={i}
          icon={
            <Tooltip
              desc={
                <div>
                  <div>currently connected wallet</div>
                  <div>click to copy full address</div>
                </div>
              }
              side="left"
              vsbl={x.public.addr === String(address)}
            >
              <GoDotFill
                className="fill-green-400"
              />
            </Tooltip>
          }
          subj={
            <CopyButton
              className="text-sm font-mono underline underline-offset-2 decoration-dashed"
              copy={x.public.addr}
              text={truncateEthAddress(x.public.addr)}
            />
          }
          midl={
            <span className="text-sm font-mono">
              {spacetime.now().since(spacetime(Number(x.intern.addr.time) * 1000, "GMT")).rounded}
            </span>
          }
          rigt={
            <button
              className="outline-none group"
              type="button"
              onClick={() => {
                walletDelete(x);
              }}
            >
              <RiDeleteBinLine
                className={`
                   w-5 h-5 text-gray-500 dark:text-gray-500
                   group-hover:text-gray-900 dark:group-hover:text-gray-50
                `}
              />
            </button>
          }
        />
      ))}
    </>
  );
};
