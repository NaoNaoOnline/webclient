import useSWR from "swr"

import { ReactionSearch } from '@/modules/api/reaction/search/Search'
import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response'

const fetcher = () => {
  return async (): Promise<ReactionSearchResponse[]> => {
    return await ReactionSearch([{ kind: "bltn" }]);
  };
};

// CacheApiReaction fetches all whitelisted emojis used for description
// reaction. Since emojis ought to almost never change, data is never refreshed
// automatically. Users will always get the latest state available on browser
// tab refresh.
export default function CacheApiReaction(): ReactionSearchResponse[] {
  const { data, error } = useSWR(
    "reaction.API/Cache", // static cache key
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
