import { usePathname } from "next/navigation";

import { EventList } from "@/components/app/event/EventList";

import { LastElement } from "@/modules/path/LastElement";

export default function Page() {
  const path: string = usePathname();
  const user: string = LastElement(path);

  return (
    <EventList
      user={decodeURIComponent(user)}
    />
  );
};
