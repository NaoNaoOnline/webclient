import { usePathname } from "next/navigation";

import spacetime from "spacetime";

import { EventOverview } from "@/components/app/event/EventOverview";

import { LastElement } from "@/modules/path/LastElement";

export default function Page() {
  const path: string = usePathname();
  const evnt: string = LastElement(path);

  const strt: string = String(Math.floor(spacetime.now().goto("GMT").subtract(1, "week").epoch / 1000));
  const stop: string = String(Math.ceil(spacetime.now().goto("GMT").add(1, "week").epoch / 1000));

  return (
    <>
      {evnt === "latest" && (
        <EventOverview
          strt={strt}
          stop={stop}
          time="page"
        />
      )}
      {evnt !== "latest" && (
        <EventOverview
          evnt={[evnt]}
          titl="Event Page"
        />
      )}
    </>
  );
};
