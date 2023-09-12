import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0/client';

import Event from '@/components/app/event/Event'
import Header from '@/components/app/layout/Header'

import CacheAuthToken from '@/modules/cache/auth/Token';

export default function Page() {
  const router = useRouter();
  const { user } = useUser();

  const [cate, setCate] = useState<string[] | undefined>(undefined);
  const [host, setHost] = useState<string[] | undefined>(undefined);

  const cat: string = CacheAuthToken(user ? true : false);

  useEffect(() => {
    if (router.isReady) {
      const cate: string[] | undefined = router.query.cate?.toString().split(",");
      if (cate && cate.length !== 0) {
        setCate(cate);
      }
      const host: string[] | undefined = router.query.host?.toString().split(",");
      if (host && host.length !== 0) {
        setHost(host);
      }
    }
  }, [router.isReady, router.query.cate, router.query.host]);

  return (
    <>
      <Header titl="Latest Events" />

      {!router.isReady && !cate && !host && (
        <></>
      )}

      {router.isReady && (cate || host) && (
        <div className="pl-4 pr-4 mt-4 md:ml-64">
          <div className="pl-4 pr-4 flex grid justify-items-center">
            <div className="w-full max-w-xl dark:text-gray-50">
              <Event
                atkn={cat}
                cate={cate}
                host={host}
              />
            </div>
          </div>
        </div >
      )}
    </>
  );
};


