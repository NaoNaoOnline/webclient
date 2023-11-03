import { ReactNode, createContext, useContext } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";

import { CacheAuthToken } from "@/modules/cache/auth/CacheAuthToken";

const defaultContextValue = {
  atkn: "",
  auth: false,
  uuid: "",
};

const TokenContext = createContext(defaultContextValue);

export const TokenProvider = ({ children }: { children: ReactNode }) => {
  const usrctx = useUser();

  const cat: string = CacheAuthToken(usrctx.user ? true : false);

  return (
    <>
      {(!usrctx.isLoading && !usrctx.user && !cat &&
        <TokenContext.Provider value={{ atkn: "", auth: false, uuid: "" }}>
          {children}
        </TokenContext.Provider>
      )}
      {(!usrctx.isLoading && usrctx.user && cat &&
        <TokenContext.Provider value={{ atkn: cat, auth: true, uuid: usrctx.user.intern?.uuid || "" }}>
          {children}
        </TokenContext.Provider>
      )}
    </>
  );
};

export const useToken = () => {
  return useContext(TokenContext);
};
