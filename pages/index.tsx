import { useUser } from '@auth0/nextjs-auth0/client';

import Event from '@/components/app/event/Event'
import Header from '@/components/app/layout/Header'

import CacheAuthToken from '@/modules/cache/auth/Token';

export default function Page() {
  const { user } = useUser();

  const cat: string = CacheAuthToken(user ? true : false);

  return (
    <>
      <Header titl="Latest Events" />

      <div className="pl-4 pr-4 mt-4 md:ml-64">
        <div className="pl-4 pr-4 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-white">
            <Event
              atkn={cat}
            />
          </div>
        </div>
      </div >
    </>
  )
}
