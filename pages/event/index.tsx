import { useSearchParams } from "next/navigation";

import { EventOverview } from "@/components/app/event/EventOverview";

export default function Page() {
  const params = useSearchParams();

  return (
    <EventOverview
      cate={params.get("cate")?.toString().split(",")}
      host={params.get("host")?.toString().split(",")}
    />
  );
};
