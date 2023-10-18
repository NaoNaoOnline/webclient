import useSWR from "swr";

import { PolicySearch } from "@/modules/api/policy/search/Search";
import { PolicySearchResponse } from "@/modules/api/policy/search/Response";

const fetcher = (atk: string) => {
  return async (): Promise<PolicySearchResponse[]> => {
    return await PolicySearch([{ atkn: atk, ltst: "default" }]);
  };
};

// CacheApiPolicy fetches all policies cached within the platform's backend.
// Since policies ought to rarely change, data is never refreshed automatically.
// Users will always get the latest state available on browser tab refresh. A
// valid access token must be provided with atk for making the RPC work
// triggered by the custom fetcher. The SWR hook can be deactivated if act is
// false.
export default function CacheApiPolicy(act: boolean, atk: string): PolicySearchResponse[] {
  const { data, error } = useSWR(
    act ? "policy.API/Cache" : null, // static cache key
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
