import useSWR from "swr"

import { LabelSearch } from '@/modules/api/label/search/Search'
import { NewLabelSearchRequest } from '@/modules/api/label/search/Request'
import { LabelSearchResponse } from '@/modules/api/label/search/Response'

const fetcher = () => {
  return async (): Promise<LabelSearchResponse[]> => {
    return await LabelSearch(NewLabelSearchRequest("cate", "host"));
  };
};

// CacheApiLabel fetches all category and host labels that exist already. Since
// labels ought to not change frequently, data is automatically refreshed every
// hour. The SWR hook can be deactivated if act is false. If act is true, a
// valid access token must be provided with atk for making the RPC work
// triggered by the custom fetcher.
export default function CacheApiLabel(): LabelSearchResponse[] {
  const { data, error } = useSWR(
    "cache/api.Label", // static cache key
    fetcher(),
    {
      refreshInterval: 60 * 60 * 1000, // every hour
      revalidateOnFocus: false,
    },
  )

  if (error || !data) return [];

  return data;
};
