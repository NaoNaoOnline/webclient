import { Chain } from "wagmi";
import { ChainIcon } from "connectkit";

import * as ToggleGroup from "@radix-ui/react-toggle-group";

import { LinkChainIcon } from "@/components/app/icon/base/LinkChainIcon";
import { RadioOffIcon } from "@/components/app/icon/base/RadioOffIcon";
import { RadioOnIcon } from "@/components/app/icon/base/RadioOnIcon";

import { getChain, useNetwork } from "@/components/app/network/NetworkProvider";
import { ListHeader } from "@/components/app/layout/ListHeader";

export function NetworkSection() {
  const [netw, setNetw] = useNetwork();

  const chns = getChain(netw);
  const curr: Chain = chns[0];

  return (
    <>
      <ListHeader
        icon={<LinkChainIcon />}
        titl={<>Platform Networks</>}
      />

      <ToggleGroup.Root
        className="mb-6"
        type="single"
        value={String(curr.id)}
        onValueChange={setNetw}
      >
        {sortChns(chns).map((x, i) => (
          <ul key={i} className="flex flex-row w-full">
            <li className="flex items-center pl-3 py-3 rounded-lg text-gray-500 dark:text-gray-500">
              <ChainIcon id={x.id} size={20} />
            </li>

            <li className="flex items-center p-3 rounded-lg text-gray-500 dark:text-gray-500">
              <span className="flex-1 w-[140px] text-sm font-mono">{x.name}</span>
            </li>

            <li className="flex items-center py-3 rounded-lg text-gray-500 dark:text-gray-500">
              <span className="w-[20px] text-sm font-mono"></span>
            </li>

            <li className="flex items-center p-3 rounded-lg text-gray-500 dark:text-gray-500">
              <span className="flex-1 w-[140px] text-right text-sm font-mono">{x.id}</span>
            </li>

            <li className="flex relative w-full items-center p-3 text-gray-500 dark:text-gray-500">
              <div className="flex-shrink-0 absolute right-0 mr-3">
                <ToggleGroup.Item className="py-3 outline-none group" value={String(x.id)}>
                  {String(curr.id) === String(x.id) && (
                    <RadioOnIcon className="w-5 h-5 mx-2 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
                  )}
                  {String(curr.id) !== String(x.id) && (
                    <RadioOffIcon className="w-5 h-5 mx-2 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
                  )}
                </ToggleGroup.Item>
              </div>
            </li>
          </ul>
        ))}
      </ToggleGroup.Root>
    </>
  );
};

const sortChns = (lis: Chain[]): Chain[] => {
  lis.sort((x: Chain, y: Chain) => {
    // Sort chains by name in accending order with first priority.
    if (x.name < y.name) return -1;
    if (x.name > y.name) return +1;

    return 0;
  });

  return lis;
};
