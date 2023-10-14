import { createContext, useContext, useEffect } from "react";

import { Chain } from "wagmi";
import { arbitrum, base, hardhat, optimism } from "wagmi/chains";

import { BlockchainNetworks } from "@/modules/config/config";

const key: string = "network.naonao.online/name";

const map: { [key: string]: string } = {
  10: "optimism",
  8453: "base",
  31337: "hardhat",
  42161: "arbitrum",
};

export const NetworkDefault = BlockchainNetworks;

export const NetworkContext = createContext<[
  string,
  (cid: string) => void
]>([
  getNetwork(),
  () => { },
]);

// net = "arbitrum,base,hardhat,optimism"
export function getChain(net: string): Chain[] {
  const chains: Chain[] = [];

  for (const x of net.split(",")) {
    switch (x) {
      case "arbitrum":
        chains.push(arbitrum);
        break;
      case "base":
        chains.push(base);
        break;
      case "hardhat":
        chains.push(hardhat);
        break;
      case "optimism":
        chains.push(optimism);
        break;
    }
  }

  return chains;
}

export function getNetwork(): string {
  if (typeof window === "undefined") {
    return NetworkDefault;
  }

  const loc = localStorage.getItem(key);
  if (loc) {
    return loc;
  }

  return NetworkDefault;
}

export function useNetwork(): [string, (cid: string) => void] {
  const [netw, setNetw] = useContext(NetworkContext);

  const updNetw = (cid: string) => {
    if (!map[cid]) {
      return;
    }

    const spl = netw.split(",");
    const ind = spl.indexOf(map[cid]);

    if (ind === -1) {
      return;
    }

    spl.splice(ind, 1);
    spl.unshift(map[cid]);

    const upd = spl.join(",");

    setNetw(upd);
    localStorage.setItem(key, upd);
  };

  // Load the user's theme configuration from local storage when the component
  // mounts client-side.
  useEffect(() => {
    setNetw(getNetwork());
  }, [setNetw]);

  return [netw, updNetw];
}
