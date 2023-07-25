import useSWR from 'swr'
import { useUser } from '@auth0/nextjs-auth0/client';

const fetcher = (url: string) =>
  fetch(url).then(res => res.json())

// Token is a SWR Module maintaining the user's session based short lived OAuth
// access token.
export default function Token() {
  const { user } = useUser();

  if (!user) return {};

  const { data, error, isLoading } = useSWR(
    "/api/auth/token",
    fetcher,
    {
      refreshInterval: 60000, // every minute
    },
  )

  return {
    token: data,
    isLoading,
    isError: error
  }
};
