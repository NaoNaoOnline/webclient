import { useSearchParams } from "next/navigation";

import { Event } from "@/components/app/event/Event";

export default function Page() {
  const params = useSearchParams();

  return (
    <Event
      cate={params.get("cate")?.toString().split(",")}
      host={params.get("host")?.toString().split(",")}
      user={params.get("user")?.toString()}
    />
  );
};
