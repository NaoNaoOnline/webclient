import { useState } from "react";

import spacetime from "spacetime";
import { useAccount } from "wagmi";

import { TrashIcon } from "@heroicons/react/24/outline";
import { FaEthereum } from "react-icons/fa";

import WalletButton from "@/components/app/settings/wallet/WalletButton";
import WalletCreateForm from "@/components/app/settings/wallet/create/WalletCreateForm";

import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";

import CacheApiWallet from '@/modules/cache/api/Wallet';

interface Props {
  atkn: string;
}

export default function WalletSection(props: Props) {
  const [addr, setAddr] = useState<string>("");
  const [wllt, setWllt] = useState<WalletSearchResponse[] | null>(null);

  const caw: WalletSearchResponse[] = CacheApiWallet(props.atkn ? true : false, props.atkn);
  if (caw && caw.length !== 0 && (!wllt || wllt.length === 0)) {
    setWllt(caw);
  }

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
          <WalletButton titl="Connect Wallet" />

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
                {/* TODO implement context menu to delete and re-sign */}
                <TrashIcon className="flex-shrink-0 absolute right-0 mr-3 w-5 h-5" />
              </li>
            </ul>
          ))}
        </>
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
