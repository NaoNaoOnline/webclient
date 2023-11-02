import { useSearchParams } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

import Event from "@/components/app/event/Event";
import Header from "@/components/app/layout/Header";

import CacheAuthToken from "@/modules/cache/auth/Token";

export default function Page() {
  const params = useSearchParams();
  const usrctx = useUser();

  const cat: string = CacheAuthToken(usrctx.user ? true : false);

  return (
    <>
      <Header titl="Latest Events" />

      <div className="px-2 mt-4 md:ml-64">
        <div className="px-2 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-gray-50">
            {(!usrctx.isLoading && !usrctx.user && !cat &&
              <Event
                atkn={""}
                cate={params.get("cate")?.toString().split(",")}
                host={params.get("host")?.toString().split(",")}
                user={params.get("user")?.toString()}
              />
            )}
            {(!usrctx.isLoading && usrctx.user && cat &&
              <Event
                atkn={cat}
                cate={params.get("cate")?.toString().split(",")}
                host={params.get("host")?.toString().split(",")}
                user={params.get("user")?.toString()}
              />
            )}
          </div>
        </div>
      </div >
    </>
  );
};
