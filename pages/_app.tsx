import "@/styles/globals.css";

import { useState } from "react";
import type { AppProps } from "next/app"
import { UserProvider } from "@auth0/nextjs-auth0/client";

import * as Toast from "@radix-ui/react-toast";

import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Mode } from "connectkit/build/types";

import { ThemeContext } from "@/components/app/theme/Theme";
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
  const [them, setThem] = useState<string>("light");

  return (
    <UserProvider>
      <Toast.Provider>
        <ThemeContext.Provider value={[them, setThem]}>
          <WagmiConfig config={config}>
            <ConnectKitProvider theme="auto" mode={them as Mode}>
              <Sidebar />
              <Component {...pageProps} />
            </ConnectKitProvider>
          </WagmiConfig>
        </ThemeContext.Provider>
      </Toast.Provider >
    </UserProvider>
  );
}
