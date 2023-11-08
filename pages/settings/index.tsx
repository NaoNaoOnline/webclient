import { useState } from "react";

import { useRouter } from "next/navigation";

import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Mode } from "connectkit/build/types";

import { getManual } from "@/components/app/theme/ManualTheme";
import { NetworkContext, getChain, getNetwork } from "@/components/app/network/Network";

import { PageHeader } from "@/components/app/layout/PageHeader";

import SettingsHeader from "@/components/app/settings/header/SettingsHeader";
import NetworkSection from "@/components/app/settings/network/NetworkSection";
import PolicySection from "@/components/app/settings/policy/PolicySection";
import ThemeSection from "@/components/app/settings/theme/ThemeSection";
import WalletSection from "@/components/app/settings/wallet/WalletSection";

import { useAuth } from "@/components/app/auth/AuthContext";

import { AlchemyAPIKey, WalletConnectProjectID } from "@/modules/config/config";

export default function Page() {
  const nxtrtr = useRouter();
  const { auth } = useAuth();

  const [manu, setManu] = useState<string>(getManual());
  const [netw, setNetw] = useState<string>(getNetwork());

  // In case unauthenticated users try to access a page that is meant to only
  // render content for authenticated users, we redirect to the generic login
  // page. We do not use info toasts since this would cause duplicated or
  // infinite re-renders based on how the webapp works right now.
  if (!auth) {
    return nxtrtr.push("/login");
  }

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
    <NetworkContext.Provider value={[netw, setNetw]}>
      <WagmiConfig config={config}>
        <ConnectKitProvider theme="auto" mode={manu as Mode}>

          <PageHeader titl="Settings" />

          <SettingsHeader />
          <ThemeSection />
          <WalletSection />
          <PolicySection />
          <NetworkSection />

        </ConnectKitProvider>
      </WagmiConfig>
    </NetworkContext.Provider>
  )
}
