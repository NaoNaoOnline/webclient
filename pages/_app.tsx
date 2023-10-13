import "@/styles/globals.css";

import { useState } from "react";
import type { AppProps } from "next/app"
import { UserProvider } from "@auth0/nextjs-auth0/client";

import * as Toast from "@radix-ui/react-toast";

import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Mode } from "connectkit/build/types";

import { ManualContext, getManual } from "@/components/app/theme/ManualTheme";
import { SystemContext, getSystem } from "@/components/app/theme/SystemTheme";
import Sidebar from "@/components/app/sidebar/Sidebar";

import { AlchemyAPIKey, WalletConnectProjectID } from "@/modules/config/config";

const config = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: AlchemyAPIKey,
    walletConnectProjectId: WalletConnectProjectID,

    // Required
    appName: "NaoNao",
  }),
);

export default function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  const [manu, setManu] = useState<string>(getManual());
  const [syst, setSyst] = useState<boolean>(getSystem());

  return (
    <UserProvider>
      <Toast.Provider>
        <ManualContext.Provider value={[manu, setManu]}>
          <SystemContext.Provider value={[syst, setSyst]}>
            <WagmiConfig config={config}>
              <ConnectKitProvider theme="auto" mode={manu as Mode}>
                <Sidebar />
                <Component {...pageProps} />
              </ConnectKitProvider>
            </WagmiConfig>
          </SystemContext.Provider>
        </ManualContext.Provider>
      </Toast.Provider>
    </UserProvider>
  );
}
