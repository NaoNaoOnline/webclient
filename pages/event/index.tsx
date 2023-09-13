import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { useUser } from '@auth0/nextjs-auth0/client';

import Event from '@/components/app/event/Event'
import Header from '@/components/app/layout/Header'

import CacheAuthToken from '@/modules/cache/auth/Token';

export default function Page() {
  const nxtrtr = useRouter();
  const usrctx = useUser();

  const [cate, setCate] = useState<string[] | undefined>(undefined);
  const [host, setHost] = useState<string[] | undefined>(undefined);
  const [user, setUser] = useState<string | undefined>(undefined);

  const cat: string = CacheAuthToken(usrctx.user ? true : false);

  useEffect(() => {
    if (nxtrtr.isReady) {
      const cate: string[] | undefined = nxtrtr.query.cate?.toString().split(",");
      if (cate && cate.length !== 0) {
        setCate(cate);
      }
      const host: string[] | undefined = nxtrtr.query.host?.toString().split(",");
      if (host && host.length !== 0) {
        setHost(host);
      }
      const user: string | undefined = nxtrtr.query.user?.toString();
      if (user && user !== "") {
        setUser(user);
      }
    }
  }, [nxtrtr.isReady, nxtrtr.query.cate, nxtrtr.query.host, nxtrtr.query.user]);

  return (
    <>
      <Header titl="Latest Events" />

      {!nxtrtr.isReady && !cate && !host && !user && (
        <></>
      )}

      {nxtrtr.isReady && (cate || host || user) && (
        <div className="pl-4 pr-4 mt-4 md:ml-64">
          <div className="pl-4 pr-4 flex grid justify-items-center">
            <div className="w-full max-w-xl dark:text-gray-50">
              <Event
                atkn={cat}
                cate={cate}
                host={host}
                user={user}
              />
            </div>
          </div>
        </div >
      )}
    </>
  );
};


