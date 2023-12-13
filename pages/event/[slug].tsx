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
      {trmSLsh(evnt) === "latest" ? (
        <EventOverview
          kind="unix"
          strt={strt}
          stop={stop}
          time="dflt"
        />
      ) : (
        <EventOverview
          evnt={[evnt]}
          kind="page"
          strt="0"
          stop="0"
          titl="Event Page"
        />
      )}
    </>
  );
};

const trmSLsh = (str: string): string => {
  if (str.endsWith('/')) {
    str = str.slice(0, -1);
  }

  return str;
};
