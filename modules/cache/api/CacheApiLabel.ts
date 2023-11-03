import useSWR from "swr";

import { LabelSearch } from "@/modules/api/label/search/Search";
import { NewLabelSearchRequest } from "@/modules/api/label/search/Request";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

const fetcher = () => {
  return async (): Promise<LabelSearchResponse[]> => {
    return await LabelSearch(NewLabelSearchRequest("bltn", "cate", "host"));
  };
};

// CacheApiLabel fetches all category and host labels that exist already. Since
// labels ought to not change frequently, data is automatically refreshed every
// hour. The SWR hook can be deactivated if act is false.
export function CacheApiLabel(): LabelSearchResponse[] {
  const { data, error } = useSWR(
    "label.API/Cache", // static cache key
    fetcher(),
    {
      refreshInterval: 60 * 60 * 1000, // every hour
      revalidateOnFocus: false,
    },
  )

  if (error || !data) return [];

  return data;
};
