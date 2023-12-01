import { ReactNode, createContext, useContext } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";

import useSWR from "swr";

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
  imag: "",
  name: "",
  prem: false,
  uuid: "",
};

const AuthContext = createContext(defaultContextValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const uctx = useUser();

  const atkn: string = FetchAuthToken(!uctx.isLoading && uctx.user ? true : false);

  if (uctx.isLoading) {
    return <></>;
  }

  return (
    <>
      {(!uctx.user && !atkn &&
        <AuthContext.Provider value={{
          atkn: "",
          auth: false,
          imag: "",
          name: "",
          prem: false,
          uuid: "",
        }}>
          {children}
        </AuthContext.Provider>
      )}
      {(uctx.user && atkn &&
        <AuthContext.Provider value={{
          atkn: atkn,
          auth: true,
          imag: uctx.user.picture || "",
          name: uctx.user.public?.name || "",
          prem: hasPrm(uctx.user.intern?.prem || "", Date.now() / 1000),
          uuid: uctx.user.intern?.uuid || "",
        }}>
          {children}
        </AuthContext.Provider>
      )}
    </>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// hasPrm expresses whether a user has an active premium subscription based on
// its Object.Prem unix timestamp, relative to the current time. Note that now
// must be formatted to unix seconds. Otherwise every user will always and
// forever have premium in the frontend.
//
//     hasPrm(user.prem, Date.now() / 1000)
//
export const hasPrm = (prm: string, now: number): boolean => {
  return prm !== "" && now < Number(prm);
};
