import { usePathname } from "next/navigation";

import { EventOverview } from "@/components/app/event/EventOverview";

import { LastElement } from "@/modules/path/LastElement";

export default function Page() {
  const path: string = usePathname();
  const cate: string = LastElement(path);

  return (
    <EventOverview
      cate={[cate]}
      kind="page"
      strt="0"
      stop="-1"
    />
  )
};
