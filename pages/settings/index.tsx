import { useRouter } from "next/navigation";

import Header from "@/components/app/layout/Header";

import SettingsHeader from "@/components/app/settings/header/SettingsHeader";
import NetworkSection from "@/components/app/settings/network/NetworkSection";
import PolicySection from "@/components/app/settings/policy/PolicySection";
import ThemeSection from "@/components/app/settings/theme/ThemeSection";
import WalletSection from "@/components/app/settings/wallet/WalletSection";

import { useToken } from "@/components/app/token/TokenContext";

export default function Page() {
  const nxtrtr = useRouter();
  const { atkn, auth } = useToken();

  // In case unauthenticated users try to access a page that is meant to only
  // render content for authenticated users, we redirect to the generic login
  // page. We do not use info toasts since this would cause duplicated or
  // infinite re-renders based on how the webapp works right now.
  if (!auth) {
    return nxtrtr.push("/login");
  }

  return (
    <>
      <Header titl="Settings" />

      <div className="px-2 mt-4 md:ml-64">
        <div className="px-2 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-gray-50">
            <SettingsHeader />
            <ThemeSection />
            <WalletSection atkn={atkn} />
            <PolicySection atkn={atkn} />
            <NetworkSection />
          </div>
        </div>
      </div >
    </>
  )
}
