import { memo } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

import Event from "@/components/app/event/Event"
import Header from "@/components/app/layout/Header"

import CacheAuthToken from "@/modules/cache/auth/Token";
import spacetime from "spacetime";

export default memo(function Page() {
  const usrctx = useUser();

  const cat: string = CacheAuthToken(usrctx.user ? true : false);

  const sta: string = String(Math.floor(spacetime.now().goto("GMT").subtract(1, "week").epoch / 1000));
  const sto: string = String(Math.ceil(spacetime.now().goto("GMT").add(1, "week").epoch / 1000));

  return (
    <>
      <Header titl="Latest Events" />

      <div className="px-2 mt-4 md:ml-64">
        <div className="px-2 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-gray-50">
            {(!usrctx.isLoading && !usrctx.user && !cat &&
              <Event
                atkn={""}
                strt={sta}
                stop={sto}
                time="page"
              />
            )}
            {(!usrctx.isLoading && usrctx.user && cat &&
              <Event
                atkn={cat}
                strt={sta}
                stop={sto}
                time="page"
              />
            )}
          </div>
        </div>
      </div >
    </>
  )
})
