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
  uuid: "",
};

const AuthContext = createContext(defaultContextValue);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const usrctx = useUser();

  const atkn: string = FetchAuthToken(!usrctx.isLoading && usrctx.user ? true : false);

  if (usrctx.isLoading) {
    return <></>;
  }

  return (
    <>
      {(!usrctx.user && !atkn &&
        <AuthContext.Provider value={{
          atkn: "",
          auth: false,
          imag: "",
          name: "",
          uuid: "",
        }}>
          {children}
        </AuthContext.Provider>
      )}
      {(usrctx.user && atkn &&
        <AuthContext.Provider value={{
          atkn: atkn,
          auth: true,
          imag: usrctx.user.picture || "",
          name: usrctx.user.public?.name || "",
          uuid: usrctx.user.intern?.uuid || "",
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
