import useSWR from "swr"

import { LabelSearch } from '@/modules/api/label/search/Search'
import { LabelSearchRequest } from '@/modules/api/label/search/Request'
import { LabelSearchResponse } from '@/modules/api/label/search/Response'

const fetcher = (atk: string) => {
  return async (): Promise<LabelSearchResponse[]> => {
    return await LabelSearch(LabelSearchRequest(atk, "cate", "host"));
  };
};

export default function CacheApiLabel(act: boolean, atk: string): LabelSearchResponse[] {
  const { data, error } = useSWR(
    act && atk ? "cache/api.Label" : null, // static cache key
    fetcher(atk),
    {
      refreshInterval: 60000, // every minute
    },
  )

  if (error || !data) return [];

  return data;
};
