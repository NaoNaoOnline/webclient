import spacetime from "spacetime";

import { EventOverview } from "@/components/app/event/EventOverview";

export default function Page() {
  const sta: string = String(Math.floor(spacetime.now().goto("GMT").subtract(1, "week").epoch / 1000));
  const sto: string = String(Math.ceil(spacetime.now().goto("GMT").add(1, "week").epoch / 1000));

  return (
    <>
      <EventOverview
        strt={sta}
        stop={sto}
        time="page"
      />
    </>
  )
};
