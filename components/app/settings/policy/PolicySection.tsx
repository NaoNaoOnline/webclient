import { useState } from "react";

import { ConnectKitButton } from "connectkit";
import spacetime from "spacetime";

import { LockClosedIcon } from "@radix-ui/react-icons";
import { TrashIcon } from "@heroicons/react/24/outline";

import PolicyCreateForm from "@/components/app/settings/policy/create/PolicyCreateForm";

import CacheApiPolicy from "@/modules/cache/api/Policy";
import { PolicySearchResponse } from "@/modules/api/policy/search/Response";

import { truncateEthAddress } from "@/modules/wallet/Address";

interface Props { }

// TODO fetch all cached policy records from apiserver
// TODO add html form for contract interaction
// TODO do only show policy section to policy members, also restrict in apiserver
// TODO list deleted records separately at the end of the list
// TODO enable policy deletion
export default function PolicySection(props: Props) {
  const [plcy, setPlcy] = useState<PolicySearchResponse[] | null>(null);

  const caw: PolicySearchResponse[] = CacheApiPolicy();
  if (caw.length !== 0 && !plcy) {
    setPlcy(caw);
  }

  return (
    <>
      <ul className="flex flex-row relative w-full pt-4 mt-4 border-t border-gray-300 dark:border-gray-800">
        <li className="flex items-center p-3 rounded-lg text-gray-900 dark:text-gray-50">
          <LockClosedIcon className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="flex-1 ml-3 whitespace-nowrap">Platform Policies</span>
        </li>

        <li className="flex absolute right-0 items-center">
          <ConnectKitButton.Custom>
            {({ isConnected, show, ensName, truncatedAddress }) => {
              return (
                <button
                  className="p-3 rounded-lg text-gray-900 dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-800 disabled:text-gray-400 dark:disabled:text-gray-400 disabled:pointer-events-none"
                  onClick={show}
                >
                  {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
                </button>
              );
            }}
          </ConnectKitButton.Custom>

          <PolicyCreateForm
            done={(pol: PolicySearchResponse) => {
              // TODO add new policy on success
            }}
          />
        </li>
      </ul>

      {plcy && (
        <>
          {sortPlcy(plcy).map((x, i) => (
            <ul key={i} className="flex flex-row w-full">
              <li className="flex items-center pl-3 py-3 rounded-lg text-gray-400 dark:text-gray-500">
                <span className="w-[20px] text-center font-mono">{x.syst}</span>
              </li>

              <li className="flex items-center p-3 rounded-lg text-gray-400 dark:text-gray-500">
                <span className="flex-1 w-[140px] font-mono">{truncateEthAddress(x.memb)}</span>
              </li>

              <li className="flex items-center py-3 rounded-lg text-gray-400 dark:text-gray-500">
                <span className="w-[20px] text-center font-mono">{x.acce}</span>
              </li>

              <li className="flex items-center p-3 rounded-lg text-gray-400 dark:text-gray-500">
                <span className="flex-1 w-[140px] text-right font-mono">{spacetime.now().since(spacetime(Number(x.extern[0].time) * 1000, "GMT")).rounded}</span>
              </li>

              <li className="flex relative w-full items-center p-3 text-gray-400 dark:text-gray-500">
                <div className="flex-shrink-0 absolute right-0 mr-3">
                  <button className="py-3 outline-none group" type="button">
                    <TrashIcon className="w-5 h-5 mx-2 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
                  </button>
                  {/* <WalletMenu
                    delt={() => walletDelete(x)}
                  /> */}
                </div>
              </li>
            </ul>
          ))}
        </>
      )}
    </>
  );
};

const sortPlcy = (lis: PolicySearchResponse[]): PolicySearchResponse[] => {
  lis.sort((x: PolicySearchResponse, y: PolicySearchResponse) => {
    // Sort policies by SMA system in accending order with first priority.
    const xsy = parseInt(x.syst, 10);
    const ysy = parseInt(y.syst, 10);

    if (xsy !== ysy) {
      return xsy - ysy;
    }

    // Sort policies by SMA access in accending order with second priority.
    const xac = parseInt(x.acce, 10);
    const yac = parseInt(y.acce, 10);

    if (xac !== yac) {
      return xac - yac;
    }

    // Sort policies by SMA member in accending order with third priority.
    if (x.memb < y.memb) return -1;
    if (x.memb > y.memb) return +1;

    return 0;
  });

  return lis;
};
