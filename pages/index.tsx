import spacetime from "spacetime";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { useCache } from "@/components/app/cache/CacheProvider";
import { EventOverview } from "@/components/app/event/EventOverview";

export default function Page() {
  const { auth } = useAuth();
  const { user } = useCache();

  const home: string = user[0]?.home;
  const strt: string = String(Math.floor(spacetime.now().goto("GMT").subtract(1, "week").epoch / 1000));
  const stop: string = String(Math.ceil(spacetime.now().goto("GMT").add(1, "week").epoch / 1000));

  return (
    <>
      {auth && home && home !== "" && home !== "/" ? (
        <EventOverview
          list={home}
        />
      ) : (
        <EventOverview
          strt={strt}
          stop={stop}
          time="page"
        />
      )}
    </>
  )
};
