import "@/styles/globals.css";

import { useEffect, useState } from "react";
import type { AppProps } from "next/app"
import { UserProvider } from "@auth0/nextjs-auth0/client";

import { AuthProvider } from "@/components/app/auth/AuthProvider";
import { CacheProvider } from "@/components/app/cache/CacheProvider";
import { Sidebar } from "@/components/app/sidebar/SidebarProvider";
import { ManualContext, getManual } from "@/components/app/theme/ManualThemeProvider";
import { SystemContext, getSystem } from "@/components/app/theme/SystemThemeProvider";
import { ToastProvider } from "@/components/app/toast/ToastProvider";
import { TooltipProvider } from "@/components/app/tooltip/TooltipProvider";

export default function App({ Component, pageProps: { ...pageProps } }: AppProps) {
  const [manu, setManu] = useState<string>(getManual());
  const [syst, setSyst] = useState<boolean>(getSystem());

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
      <AuthProvider>
        <CacheProvider>
          <ToastProvider>
            <TooltipProvider>
              <ManualContext.Provider value={[manu, setManu]}>
                <SystemContext.Provider value={[syst, setSyst]}>

                  <div className="mt-4 justify-items-center">
                    <div className="m-auto w-full max-w-xl">

                      <Component {...pageProps} />

                    </div>
                  </div>

                  <Sidebar />

                </SystemContext.Provider>
              </ManualContext.Provider>
            </TooltipProvider>
          </ToastProvider>
        </CacheProvider>
      </AuthProvider>
    </UserProvider>
  );
}
