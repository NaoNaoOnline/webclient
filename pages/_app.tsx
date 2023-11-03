import "@/styles/globals.css";

import { useEffect, useState } from "react";
import type { AppProps } from "next/app"
import { UserProvider } from "@auth0/nextjs-auth0/client";

import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Mode } from "connectkit/build/types";

import { CacheProvider } from "@/components/app/cache/CacheContext";
import { NetworkContext, getChain, getNetwork } from "@/components/app/network/Network";
import Sidebar from "@/components/app/sidebar/Sidebar";
import { ManualContext, getManual } from "@/components/app/theme/ManualTheme";
import { SystemContext, getSystem } from "@/components/app/theme/SystemTheme";
import { ToastProvider } from "@/components/app/toast/ToastContext";
import { TokenProvider } from "@/components/app/token/TokenContext";

import { AlchemyAPIKey, WalletConnectProjectID } from "@/modules/config/config";

export default function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  const [manu, setManu] = useState<string>(getManual());
  const [netw, setNetw] = useState<string>(getNetwork());
  const [syst, setSyst] = useState<boolean>(getSystem());

  const config = createConfig(
    getDefaultConfig({
      // required
      appName: "NaoNao",

      alchemyId: AlchemyAPIKey,
      walletConnectProjectId: WalletConnectProjectID,

      // custom
      chains: getChain(netw),
    }),
  );

  // Prevent loud errors due to unsupported contracts during development.
  //
  //     https://github.com/wagmi-dev/viem/discussions/781
  //
  useEffect(() => {
    const orig = window.console.error;
    window.console.error = function (...args) {
      const str: string | null = args[0]?.toString();

      if (str) {
        const one: boolean = str.includes("ChainDoesNotSupportContract");
        const two: boolean = str.includes("Hardhat");
        const thr: boolean = str.includes("ensUniversalResolver");

        if (one && two && thr) {
          return;
        }
      }

      orig.apply(window.console, args);
    };
  }, []);

  return (
    <UserProvider>
      <TokenProvider>
        <CacheProvider>
          <ToastProvider>
            <ManualContext.Provider value={[manu, setManu]}>
              <SystemContext.Provider value={[syst, setSyst]}>
                <NetworkContext.Provider value={[netw, setNetw]}>
                  <WagmiConfig config={config}>
                    <ConnectKitProvider theme="auto" mode={manu as Mode}>
                      <Sidebar />
                      <Component {...pageProps} />
                    </ConnectKitProvider>
                  </WagmiConfig>
                </NetworkContext.Provider>
              </SystemContext.Provider>
            </ManualContext.Provider>
          </ToastProvider>
        </CacheProvider>
      </TokenProvider>
    </UserProvider>
  );
}
