import { useUser } from "@auth0/nextjs-auth0/client";

import Header from "@/components/app/layout/Header";

import SettingsHeader from "@/components/app/settings/header/SettingsHeader";
import NetworkSection from "@/components/app/settings/network/NetworkSection";
import PolicySection from "@/components/app/settings/policy/PolicySection";
import ThemeSection from "@/components/app/settings/theme/ThemeSection";
import WalletSection from "@/components/app/settings/wallet/WalletSection";

import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastContext";

import CacheAuthToken from "@/modules/cache/auth/Token";

export default function Page() {
  const { addInfo } = useToast();
  const { user, isLoading } = useUser();

  const cat: string = CacheAuthToken(user ? true : false);

  if (!isLoading && !user) {
    addInfo(new InfoPropsObject("Join the beavers and login for accessing your settings. Or else!"));
    return <></>;
  }

  return (
    <>
      <Header titl="Settings" />

      <div className="px-2 mt-4 md:ml-64">
        <div className="px-2 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-gray-50">
            {!isLoading && user && cat && (
              <>
                <SettingsHeader />
                <ThemeSection />
                <WalletSection atkn={cat} />
                <PolicySection atkn={cat} />
                <NetworkSection />
              </>
            )}
          </div>
        </div>
      </div >
    </>
  )
}
