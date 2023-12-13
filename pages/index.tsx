import spacetime from "spacetime";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { useCache } from "@/components/app/cache/CacheProvider";
import { EventOverview } from "@/components/app/event/EventOverview";

export default function Page() {
  const { auth } = useAuth();
  const { user } = useCache();

  const strt: string = String(Math.floor(spacetime.now().goto("GMT").subtract(1, "week").epoch / 1000));
  const stop: string = String(Math.ceil(spacetime.now().goto("GMT").add(1, "week").epoch / 1000));

  return (
    <>
      {auth && user?.home !== "" && user?.home !== "/" ? (
        <EventOverview
          list={user?.home}
          kind="page"
          strt="0"
          stop="-1"
        />
      ) : (
        <EventOverview
          kind="unix"
          strt={strt}
          stop={stop}
          time="dflt"
        />
      )}
    </>
  )
};
