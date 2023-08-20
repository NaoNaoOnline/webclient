import useSWR from "swr"

import { RatingSearch } from '@/modules/api/rating/search/Search'
import { RatingSearchResponse } from '@/modules/api/rating/search/Response'

const fetcher = (atk: string) => {
  return async (): Promise<RatingSearchResponse[]> => {
    return await RatingSearch({ atkn: atk });
  };
};

export default function CacheApiRating(act: boolean, atk: string): RatingSearchResponse[] {
  const { data, error } = useSWR(
    act && atk ? "cache/api.Rating" : null, // static cache key
    fetcher(atk),
  )

  if (error || !data) return [];

  return data;
};
