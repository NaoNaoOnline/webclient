import useSWR from "swr";

import { ListSearch } from "@/modules/api/list/search/Search";
import { ListSearchResponse } from "@/modules/api/list/search/Response";

const fetcher = (atk: string, use: string) => {
  return async (): Promise<ListSearchResponse[]> => {
    return await ListSearch([{ atkn: atk, user: use }]);
  };
};

// CacheApiList fetches all lists owned by the given user ID. Since lists do
// only change while the user manages them, data is never refreshed
// automatically. Users will always get the latest state available on browser
// tab refresh. A valid access token must be provided with atk for making the
// RPC work triggered by the custom fetcher. The SWR hook can be deactivated if
// act is false.
export function CacheApiList(act: boolean, atk: string, use: string): ListSearchResponse[] {
  const { data, error } = useSWR(
    act ? "list.API/Cache" : null, // static cache key
    fetcher(atk, use),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    },
  )

  if (error || !data) return [];

  return data;
};
