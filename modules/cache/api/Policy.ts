import useSWR from "swr";

import { PolicySearch } from "@/modules/api/policy/search/Search";
import { PolicySearchResponse } from "@/modules/api/policy/search/Response";

const fetcher = () => {
  return async (): Promise<PolicySearchResponse[]> => {
    return await PolicySearch([{ ltst: "default" }]);
  };
};

// CacheApiPolicy fetches all policies cached within the platform's backend.
// Since policies ought to rarely change, data is never refreshed automatically.
// Users will always get the latest state available on browser tab refresh.
export default function CacheApiPolicy(): PolicySearchResponse[] {
  const { data, error } = useSWR(
    "policy.API/Cache", // static cache key
    fetcher(),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    },
  )

  if (error || !data) return [];

  return data;
};
