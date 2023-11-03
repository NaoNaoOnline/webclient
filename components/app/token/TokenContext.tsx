import { ReactNode, createContext, useContext } from "react";
import useSWR from "swr";

import { useUser } from "@auth0/nextjs-auth0/client";

const fetcher = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const dat = await res.clone().json();

  return dat;
};

// FetchAuthToken is a SWR Module maintaining the user's session based short
// lived OAuth access token. Since access tokens ought to change very
// frequently, data is automatically refreshed every minute. The SWR hook can be
// deactivated if act is false.
const FetchAuthToken = (act: boolean): string => {
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

const defaultContextValue = {
  atkn: "",
  auth: false,
  uuid: "",
};

const TokenContext = createContext(defaultContextValue);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const usrctx = useUser();

  if (usrctx.isLoading) {
    return <></>;
  }

  const atkn: string = FetchAuthToken(usrctx.user ? true : false);

  return (
    <>
      {(!usrctx.user && !atkn &&
        <TokenContext.Provider value={{ atkn: "", auth: false, uuid: "" }}>
          {children}
        </TokenContext.Provider>
      )}
      {(usrctx.user && atkn &&
        <TokenContext.Provider value={{ atkn: atkn, auth: true, uuid: usrctx.user.intern?.uuid || "" }}>
          {children}
        </TokenContext.Provider>
      )}
    </>
  );
};

export const useToken = () => {
  return useContext(TokenContext);
};
