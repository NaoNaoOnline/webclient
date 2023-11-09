import spacetime from "spacetime";

import { EventList } from "@/components/app/event/EventList";

export default function Page() {
  const sta: string = String(Math.floor(spacetime.now().goto("GMT").subtract(1, "week").epoch / 1000));
  const sto: string = String(Math.ceil(spacetime.now().goto("GMT").add(1, "week").epoch / 1000));

  return (
    <>
      <EventList
        strt={sta}
        stop={sto}
        time="page"
      />
    </>
  )
};
