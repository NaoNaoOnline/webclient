import useSWR from "swr";

const fetcher = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const dat = await res.clone().json();

  return dat;
};

// CacheAuthToken is a SWR Module maintaining the user's session based short
// lived OAuth access token. Since access tokens ought to change very
// frequently, data is automatically refreshed every minute. The SWR hook can be
// deactivated if act is false.
export function CacheAuthToken(act: boolean): string {
  const { data, error } = useSWR(
    act ? "/api/auth/token" : null, // nodejs server url
    fetcher,
    {
      refreshInterval: 60 * 1000, // every minute
    },
  )

  if (error || !data) return "";

  return data;
};
