import { useState } from "react";

import { ConnectKitButton } from "connectkit";
import spacetime from "spacetime";
import { useAccount } from "wagmi";

import { FaEthereum } from "react-icons/fa";

import CopyButton from "@/components/app/button/CopyButton";

import WalletMenu from "@/components/app/settings/wallet/WalletMenu";
import WalletCreateForm from "@/components/app/settings/wallet/create/WalletCreateForm";

import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastContext";

import { WalletDelete } from "@/modules/api/wallet/delete/Delete";
import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";

import CacheApiWallet from "@/modules/cache/api/Wallet";

import { truncateEthAddress } from "@/modules/wallet/Address";

interface Props {
  atkn: string;
}

export default function WalletSection(props: Props) {
  const { addErro, addPgrs, addScss } = useToast();

  const [addr, setAddr] = useState<string>("");
  const [clck, setClck] = useState<boolean>(false);
  const [wllt, setWllt] = useState<WalletSearchResponse[] | null>(null);

  // Setting the user's wallets based on the backend state should only happen
  // initially. If a user deletes all wallets then CacheApiWallet may still
  // provide locally cached wallet objects which should not be rendered anymore.
  // Below we work with the assumption that the uninitialized wllt value is
  // null, so that once it is an array of length 0, then setWllt is not being
  // called anymore with the old state of caw, because we are then in the middle
  // of the user experience.
  const caw: WalletSearchResponse[] = CacheApiWallet(props.atkn ? true : false, props.atkn);
  if (caw.length !== 0 && !wllt) {
    setWllt(caw);
  }

  const erro: ErrorPropsObject = new ErrorPropsObject("Outrage, and the beavers are plundering again out of town!");
  const pgrs: ProgressPropsObject = new ProgressPropsObject("Removing Wallet");
  const scss: SuccessPropsObject = new SuccessPropsObject("We trashed it Pinky, that wallet's dust!");

  const walletDelete = async function (wal: WalletSearchResponse) {
    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [del] = await WalletDelete([{ atkn: props.atkn, wllt: wal.intern.wllt }]);

      pgrs.setDone(() => {
        setWllt((old: WalletSearchResponse[] | null) => {
          if (old) return old.filter((x) => wal.intern.wllt !== x.intern.wllt);
          return old;
        });
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      erro.setTech(err as Error);
      addErro(erro);
      setClck(false);
    }
  };

  useAccount({
    onConnect({ address }) {
      setAddr(address as string);
    },
    onDisconnect() {
      setAddr("");
    },
  });

  return (
    <>
      <ul className="flex flex-row relative w-full pt-4 mt-4 border-t border-gray-300 dark:border-gray-800">
        <li className="flex items-center p-3 rounded-lg text-gray-900 dark:text-gray-50">
          <FaEthereum className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="flex-1 ml-3 whitespace-nowrap">My Wallets</span>
        </li>

        <li className="flex absolute right-0 items-center">
          <ConnectKitButton.Custom>
            {({ isConnected, show, ensName, truncatedAddress }) => {
              return (
                <button
                  className="text-sm font-medium rounded-lg w-full md:w-auto px-5 py-2.5 text-center disabled:text-gray-50 disabled:dark:text-gray-700 disabled:bg-gray-200 disabled:dark:bg-gray-800 enabled:text-gray-50 enabled:dark:text-gray-50 enabled:bg-blue-600 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-500"
                  disabled={wllt && wllt.length >= 5 ? true : false}
                  onClick={() => {
                    if (!isConnected && show) {
                      setClck(true);
                      show();
                    }
                  }}
                >
                  {clck && isConnected ? ensName ?? truncatedAddress : "Add Wallet"}
                </button>
              );
            }}
          </ConnectKitButton.Custom>

          <WalletCreateForm
            actv={clck}
            cncl={() => {
              setClck(false);
            }}
            atkn={props.atkn}
            done={(wal: WalletSearchResponse) => {
              setWllt((old: WalletSearchResponse[] | null) => {
                if (old === null) return [wal];

                const ind = old.findIndex((x) => x.intern.wllt === wal.intern.wllt);

                if (ind === -1) return [...old, wal];

                const upd = [...old];
                upd[ind] = wal;
                return upd;
              });

              setClck(false);
            }}

            wllt={wllt}
          />
        </li>
      </ul>

      {wllt && (
        <>
          {sortWllt(wllt).map((x, i) => (
            <ul key={i} className="flex flex-row w-full">
              <li className={`flex items-center pl-3 py-3 rounded-lg ${x.public.addr === addr ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                <span className="w-[20px] text-center text-sm font-mono"></span>
              </li>

              <li className={`flex items-center p-3 rounded-lg ${x.public.addr === addr ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                <span className="flex-1 w-[127px]">
                  <CopyButton
                    className="text-sm font-mono underline underline-offset-2 decoration-dashed"
                    copy={x.public.addr}
                    text={truncateEthAddress(x.public.addr)}
                  />
                </span>
              </li>

              <li className={`flex items-center py-3 rounded-lg ${x.public.addr === addr ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                <span className="w-[20px] text-center text-sm font-mono"></span>
              </li>

              <li className={`flex items-center p-3 rounded-lg ${x.public.addr === addr ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                <span className="flex-1 w-[140px] text-right text-sm font-mono">{spacetime.now().since(spacetime(Number(x.intern.addr.time) * 1000, "GMT")).rounded}</span>
              </li>

              <li className={`flex relative w-full items-center p-3 ${x.public.addr === addr ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                <div className="flex-shrink-0 absolute right-0 mr-3">
                  <WalletMenu
                    clck={() => setClck(true)}
                    delt={() => walletDelete(x)}
                  />
                </div>
              </li>
            </ul>
          ))}
        </>
      )}
    </>
  );
};

const sortWllt = (lis: WalletSearchResponse[]): WalletSearchResponse[] => {
  lis.sort((x: WalletSearchResponse, y: WalletSearchResponse) => {
    if (x.public.addr < y.public.addr) return -1;
    if (x.public.addr > y.public.addr) return +1;
    return 0;
  });

  return lis;
};
