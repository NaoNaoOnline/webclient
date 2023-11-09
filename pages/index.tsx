import { useAuth } from "@/components/app/auth/AuthProvider";
import { useCache } from "@/components/app/cache/CacheProvider";
import { EventList } from "@/components/app/event/EventList";

import spacetime from "spacetime";

export default function Page() {
  const { auth } = useAuth();
  const { user } = useCache();

  const sta: string = String(Math.floor(spacetime.now().goto("GMT").subtract(1, "week").epoch / 1000));
  const sto: string = String(Math.ceil(spacetime.now().goto("GMT").add(1, "week").epoch / 1000));

  return (
    <>
      {auth && user[0].home !== "" && user[0].home !== "/" && (
        <EventList
          list={user[0].home}
        />
      )}
      {(!auth || !user[0].home || user[0].home === "" || user[0].home === "/") && (
        <EventList
          strt={sta}
          stop={sto}
          time="page"
        />
      )}
    </>
  )
};
