import { useSearchParams } from "next/navigation";

import { EventList } from "@/components/app/event/EventList";

export default function Page() {
  const params = useSearchParams();

  return (
    <EventList
      cate={params.get("cate")?.toString().split(",")}
      host={params.get("host")?.toString().split(",")}
      user={params.get("user")?.toString()}
    />
  );
};
