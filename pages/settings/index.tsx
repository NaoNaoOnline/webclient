import { useUser } from "@auth0/nextjs-auth0/client";

import Header from "@/components/app/layout/Header";

import SettingsHeader from "@/components/app/settings/header/SettingsHeader";
import WalletSection from "@/components/app/settings/wallet/WalletSection";

import InfoToast from "@/components/app/toast/InfoToast";

import CacheAuthToken from '@/modules/cache/auth/Token';

export default function Page() {
  const { user, isLoading } = useUser();

  const cat: string = CacheAuthToken(user ? true : false);

  return (
    <>
      <Header titl="Settings" />

      <div className="px-2 mt-4 md:ml-64">
        <div className="px-2 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-gray-50">
            {isLoading && (
              <></>
            )}
            {!isLoading && user && (
              <>
                <SettingsHeader />
                <WalletSection atkn={cat} />
              </>
            )}
            {!isLoading && !user && (
              <InfoToast
                desc="Join the beavers and login for accessing your settings. Or else!"
              />
            )}
          </div>
        </div>
      </div >
    </>
  )
}
