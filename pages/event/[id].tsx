import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0/client";

import Event from "@/components/app/event/Event";
import Header from "@/components/app/layout/Header";

import CacheAuthToken from "@/modules/cache/auth/Token";

export default function Page() {
  const nxtrtr = useRouter();
  const usrctx = useUser();

  const [evnt, setEvnt] = useState<string>("");

  const cat: string = CacheAuthToken(usrctx.user ? true : false);

  useEffect(() => {
    if (nxtrtr.isReady) {
      setEvnt(nxtrtr.query.id?.toString() || "");
    }
  }, [nxtrtr.isReady, nxtrtr.query.id]);

  return (
    <>
      <Header titl="Event" />

      <div className="px-2 mt-4 md:ml-64">
        <div className="px-2 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-gray-50">
            {(!usrctx.isLoading && !usrctx.user && !cat && nxtrtr.isReady && evnt &&
              <Event
                atkn={""}
                evnt={[evnt]}
              />
            )}
            {(!usrctx.isLoading && usrctx.user && cat && nxtrtr.isReady && evnt &&
              <Event
                atkn={cat}
                evnt={[evnt]}
              />
            )}
          </div>
        </div>
      </div >
    </>
  );
};
