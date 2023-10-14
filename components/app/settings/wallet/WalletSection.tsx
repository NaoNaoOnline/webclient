import { useState } from "react";

import { ConnectKitButton } from "connectkit";
import spacetime from "spacetime";
import { useAccount } from "wagmi";

import { FaEthereum } from "react-icons/fa";

import WalletMenu from "@/components/app/settings/wallet/WalletMenu";
import WalletCreateForm from "@/components/app/settings/wallet/create/WalletCreateForm";

import ErrorToast from "@/components/app/toast/ErrorToast";
import ProgressToast from "@/components/app/toast/ProgressToast";
import SuccessToast from "@/components/app/toast/SuccessToast";

import { WalletDelete } from "@/modules/api/wallet/delete/Delete";
import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";

import CacheApiWallet from "@/modules/cache/api/Wallet";

import Errors from "@/modules/errors/Errors";

interface Props {
  atkn: string;
}

export default function WalletSection(props: Props) {
  const [addr, setAddr] = useState<string>("");
  const [cmpl, setCmpl] = useState<number>(0);
  const [cncl, setCncl] = useState<boolean>(false);
  const [dltd, setDltd] = useState<WalletSearchResponse | null>(null);
  const [erro, setErro] = useState<Errors[]>([]);
  const [sbmt, setSbmt] = useState<boolean[]>([]);
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

  const walletDelete = async function (wal: WalletSearchResponse) {
    setCmpl(10);
    setCncl(false);
    setSbmt((old: boolean[]) => [...old, true]);

    try {
      setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [del] = await WalletDelete([{ atkn: props.atkn, wllt: wal.intern.wllt }]);

      setCmpl(100);
      await new Promise(r => setTimeout(r, 200));

      setDltd(wal);

    } catch (err) {
      setCmpl(0);
      setCncl(true);
      setErro((old: Errors[]) => [...old, new Errors("Outrage, and the beavers are plundering again out of town!", err as Error)]);
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
                  className="p-3 rounded-lg text-gray-900 dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-400 disabled:pointer-events-none"
                  disabled={wllt && wllt.length >= 5 ? true : false}
                  onClick={show}
                >
                  {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
                </button>
              );
            }}
          </ConnectKitButton.Custom>

          <WalletCreateForm
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
                <span className="w-[20px] text-center font-mono"></span>
              </li>

              <li className={`flex items-center p-3 rounded-lg ${x.public.addr === addr ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                <span className="flex-1 w-[140px] text-center font-mono">{truncateEthAddress(x.public.addr)}</span>
              </li>

              <li className={`flex items-center py-3 rounded-lg ${x.public.addr === addr ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                <span className="w-[20px] text-center font-mono"></span>
              </li>

              <li className={`flex items-center p-3 rounded-lg ${x.public.addr === addr ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                <span className="flex-1 w-[140px] text-right font-mono">{spacetime.now().since(spacetime(Number(x.intern.addr.time) * 1000, "GMT")).rounded}</span>
              </li>

              <li className={`flex relative w-full items-center p-3 ${x.public.addr === addr ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                <div className="flex-shrink-0 absolute right-0 mr-3">
                  <WalletMenu
                    delt={() => walletDelete(x)}
                  />
                </div>
              </li>
            </ul>
          ))}
        </>
      )}

      {sbmt.map((x, i) => (
        <ProgressToast
          key={i}
          cmpl={cmpl}
          cncl={cncl}
          desc="Removing Wallet"
          done={() => {
            if (wllt && dltd) {
              setWllt((old: WalletSearchResponse[] | null) => {
                if (old) return old.filter((x) => dltd.intern.wllt !== x.intern.wllt);
                return old;
              });
              setDltd(null);
            }
          }}
        />
      ))}

      {erro.map((x, i) => (
        <ErrorToast
          key={i}
          erro={x}
        />
      ))}

      {cmpl >= 100 && (
        <SuccessToast
          desc="We trashed it Pinky, that wallet's dust!"
        />
      )}
    </>
  );
};

// The below code is copied from the connectkit source code since it does not
// look like they export the function to truncate addresses at this point.

const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

const truncateEthAddress = (address?: string, separator: string = '••••') => {
  if (!address) return '';
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}${separator}${match[2]}`;
};

const sortWllt = (lis: WalletSearchResponse[]): WalletSearchResponse[] => {
  lis.sort((x: WalletSearchResponse, y: WalletSearchResponse) => {
    if (x.public.addr < y.public.addr) return -1;
    if (x.public.addr > y.public.addr) return +1;
    return 0;
  });

  return lis;
};
