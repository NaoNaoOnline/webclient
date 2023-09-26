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
import { WalletDeleteResponse } from "@/modules/api/wallet/delete/Response";
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
  // null, so that once it is an array of length 0 wllt is not updated anymore,
  // because we are then in the middle of the user experience.
  const caw: WalletSearchResponse[] = CacheApiWallet(props.atkn ? true : false, props.atkn);
  if (caw.length !== 0 && !wllt) {
    setWllt(caw);
  }

  const walletDelete = async function (wal: WalletSearchResponse): Promise<WalletDeleteResponse> {
    setCmpl(10);
    setCncl(false);
    setSbmt((old: boolean[]) => [...old, true]);

    try {
      setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [res] = await WalletDelete([{ atkn: props.atkn, wllt: wal.wllt }]);

      setCmpl(100);
      await new Promise(r => setTimeout(r, 200));

      return res;
    } catch (err) {
      setCmpl(0);
      setCncl(true);
      setErro((old: Errors[]) => [...old, new Errors("Outrage, and the beavers are plundering again out of town!", err as Error)]);

      return Promise.reject(err);
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
        <li className="flex items-center p-3 text-gray-900 rounded-lg dark:text-gray-50">
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

                const ind = old.findIndex((x) => x.wllt === wal.wllt);

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
              <li className={`flex items-center p-3 rounded-lg ${x.addr === addr ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                <span className="w-[20px]"></span>
                <span className="flex-1 w-[120px] ml-3 whitespace-nowrap">{truncateEthAddress(x.addr)}</span>
              </li>

              <li className={`flex items-center pl-6 p-3 rounded-lg ${x.addr === addr ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                <span className="flex-1 w-[120px] ml-3 whitespace-nowrap text-right">{spacetime.now().since(spacetime(Number(x.last) * 1000, "GMT")).rounded}</span>
              </li>

              <li className={`flex relative w-full items-center p-3 ${x.addr === addr ? "text-gray-500 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
                <div className="flex-shrink-0 absolute right-0 mr-3">
                  <WalletMenu
                    delt={() => {
                      walletDelete(x).then(
                        // onfulfilled removes the deleted wallet from the
                        // user's local copy.
                        () => {
                          setDltd(x);
                        },
                      );
                    }}
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
          desc="Removing Existing Wallet"
          done={() => {
            if (wllt && dltd) {
              setWllt((old: WalletSearchResponse[] | null) => {
                // if (old) return old.filter((x) => dltd.wllt !== x.wllt);
                if (old) {
                  const fil = old.filter((x) => dltd.wllt !== x.wllt);
                  console.log("fil", fil);
                  return fil;
                }
                console.log("old", old);
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
    if (x.addr < y.addr) return -1;
    if (x.addr > y.addr) return 1;
    return 0;
  });

  return lis;
};
