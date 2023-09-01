import useSWR from "swr"

import { ReactionSearch } from '@/modules/api/reaction/search/Search'
import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response'

const fetcher = () => {
  return async (): Promise<ReactionSearchResponse[]> => {
    return await ReactionSearch([]);
  };
};

// CacheApiReaction fetches all whitelisted emojis used for description reaction.
// Since emojis ought to almost never change, data is never refreshed
// automatically. Users will always get the latest state available on browser
// tab refresh. If act is true, a valid access token must be provided with atk
// for making the RPC work triggered by the custom fetcher.
export default function CacheApiReaction(): ReactionSearchResponse[] {
  const { data, error } = useSWR(
    "cache/api.Reaction", // static cache key
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
