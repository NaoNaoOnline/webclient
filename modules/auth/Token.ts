import useSWR from "swr"

const fetcher = (url: string) =>
  fetch(url).then(res => res.json())

// Token is a SWR Module maintaining the user's session based short lived OAuth
// access token.
export default function Token(): string {
  const { data, error } = useSWR(
    "/api/auth/token",
    fetcher,
    {
      refreshInterval: 60000, // every minute
    },
  )

  if (error) throw error

  return data;
};
