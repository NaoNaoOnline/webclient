import { useUser } from "@auth0/nextjs-auth0/client";

import Event from "@/components/app/event/Event";
import Header from "@/components/app/layout/Header";

import CacheAuthToken from "@/modules/cache/auth/Token";

export default function Page() {
  const usrctx = useUser();

  const cat: string = CacheAuthToken(usrctx.user ? true : false);

  return (
    <>
      <Header titl="Latest Events" />

      {!usrctx.isLoading && (
        <div className="px-2 mt-4 md:ml-64">
          <div className="px-2 flex grid justify-items-center">
            <div className="w-full max-w-xl dark:text-gray-50">
              {(!usrctx.isLoading && !usrctx.user && !cat &&
                <Event
                  atkn={""}
                  rctn="page"
                  strt={"0"}
                  stop={"-1"}
                />
              )}
              {(!usrctx.isLoading && usrctx.user && cat &&
                <Event
                  atkn={cat}
                  rctn="page"
                  strt={"0"}
                  stop={"-1"}
                />
              )}
            </div>
          </div>
        </div >
      )}
    </>
  )
}
