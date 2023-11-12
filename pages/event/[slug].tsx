import { usePathname } from "next/navigation";

import { EventOverview } from "@/components/app/event/EventOverview";

import { LastElement } from "@/modules/path/LastElement";

export default function Page() {
  const path: string = usePathname();
  const evnt: string = LastElement(path);

  return (
    <>
      <EventOverview
        evnt={[evnt]}
        titl="Event Page"
      />
    </>
  );
};
