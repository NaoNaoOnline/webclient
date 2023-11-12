import { usePathname } from "next/navigation";

import { EventOverview } from "@/components/app/event/EventOverview";

import { LastElement } from "@/modules/path/LastElement";

export default function Page() {
  const path: string = usePathname();
  const user: string = LastElement(path);

  return (
    <EventOverview
      like={user}
      strt={"0"}
      stop={"-1"}
    />
  )
};
