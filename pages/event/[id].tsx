import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import Event from "@/components/app/event/Event";
import Header from "@/components/app/layout/Header";

import CacheAuthToken from "@/modules/cache/auth/Token";

export default function Page() {
  const patnam = usePathname();
  const usrctx = useUser();

  const cat: string = CacheAuthToken(usrctx.user ? true : false);

  return (
    <>
      <Header titl="Event" />

      <div className="px-2 mt-4 md:ml-64">
        <div className="px-2 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-gray-50">
            {(!usrctx.isLoading && !usrctx.user && !cat &&
              <Event
                atkn={""}
                evnt={[lasEle(patnam)]}
              />
            )}
            {(!usrctx.isLoading && usrctx.user && cat &&
              <Event
                atkn={cat}
                evnt={[lasEle(patnam)]}
              />
            )}
          </div>
        </div>
      </div >
    </>
  );
};

// lasEle returns the last path element of the current page's URL, where the
// page is supposed to be the event page compliant with the following format.
//
//     /event/1698943315449571
//
const lasEle = function (str: string): string {
  const spl = str.split('/');

  if (spl.length >= 2 && spl[spl.length - 2] === "event") {
    return spl[spl.length - 1];
  }

  return "";
}
