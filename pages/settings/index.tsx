import { useState } from "react";

import { useRouter } from "next/navigation";

import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Mode } from "connectkit/build/types";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { useCache } from "@/components/app/cache/CacheProvider";
import { PageHeader } from "@/components/app/layout/PageHeader";
import { NetworkContext, getChain, getNetwork } from "@/components/app/network/NetworkProvider";
import SettingsHeader from "@/components/app/settings/header/SettingsHeader";
import { NetworkSection } from "@/components/app/settings/network/NetworkSection";
import PolicySection from "@/components/app/settings/policy/PolicySection";
import { getManual } from "@/components/app/theme/ManualThemeProvider";
import ThemeSection from "@/components/app/settings/theme/ThemeSection";
import WalletSection from "@/components/app/settings/wallet/WalletSection";

import { AlchemyAPIKey, WalletConnectProjectID } from "@/modules/config/config";

export default function Page() {
  const nxtrtr = useRouter();

  const { auth, uuid } = useAuth();
  const { hasPlcy } = useCache();

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
          {hasPlcy(uuid) && (
            < PolicySection />
          )}
          <NetworkSection />

        </ConnectKitProvider>
      </WagmiConfig>
    </NetworkContext.Provider>
  )
}
