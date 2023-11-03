import useSWR from "swr";

import { WalletSearch } from "@/modules/api/wallet/search/Search";
import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";

const fetcher = (atk: string) => {
  return async (): Promise<WalletSearchResponse[]> => {
    return await WalletSearch([{ atkn: atk, kind: "eth", wllt: "" }]);
  };
};

// CacheApiWallet fetches all wallets belonging to the current user. Since
// wallets ought to rarely change, data is never refreshed automatically. Users
// will always get the latest state available on browser tab refresh. A valid
// access token must be provided with atk for making the RPC work triggered by
// the custom fetcher. The SWR hook can be deactivated if act is false.
export function CacheApiWallet(act: boolean, atk: string): WalletSearchResponse[] {
  const { data, error } = useSWR(
    act ? "wallet.API/Cache" : null, // static cache key
    fetcher(atk),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    },
  )

  if (error || !data) return [];

  return data;
};
