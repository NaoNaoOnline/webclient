import "@/styles/globals.css";

import { useState } from "react";
import type { AppProps } from "next/app"
import { UserProvider } from "@auth0/nextjs-auth0/client";

import * as Toast from "@radix-ui/react-toast";

import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Mode } from "connectkit/build/types";

import { ManualContext, getManual } from "@/components/app/theme/ManualTheme";
import { NetworkContext, getChain, getNetwork } from "@/components/app/network/Network";
import { SystemContext, getSystem } from "@/components/app/theme/SystemTheme";
import Sidebar from "@/components/app/sidebar/Sidebar";

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

  return (
    <UserProvider>
      <Toast.Provider>
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
      </Toast.Provider>
    </UserProvider>
  );
}
