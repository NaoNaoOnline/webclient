import useSWR from "swr"

const fetcher = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const dat = await res.clone().json();

  return dat;
};

// CacheAuthToken is a SWR Module maintaining the user's session based short
// lived OAuth access token.
export default function CacheAuthToken(act: boolean): string {
  const { data, error } = useSWR(
    act ? "/api/auth/token" : null, // nodejs server url
    fetcher,
    {
      refreshInterval: 60000, // every minute
    },
  )

  if (error || !data) return "";

  return data;
};
