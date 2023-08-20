import useSWR from "swr"

import { RatingSearch } from '@/modules/api/rating/search/Search'
import { RatingSearchResponse } from '@/modules/api/rating/search/Response'

const fetcher = (atk: string) => {
  return async (): Promise<RatingSearchResponse[]> => {
    return await RatingSearch({ atkn: atk });
  };
};

// CacheApiRating fetches all whitelisted emojis used for description rating.
// Since emojis ought to almost never change, data is never refreshed
// automatically. Users will always get the latest state available on browser
// tab refresh. If act is true, a valid access token must be provided with atk
// for making the RPC work triggered by the custom fetcher.
export default function CacheApiRating(act: boolean, atk: string): RatingSearchResponse[] {
  const { data, error } = useSWR(
    act && atk ? "cache/api.Rating" : null, // static cache key
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
