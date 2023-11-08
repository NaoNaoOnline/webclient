import { usePathname } from "next/navigation";

import { Event } from "@/components/app/event/Event";

export default function Page() {
  const patnam = usePathname();

  return (
    <>
      <Event
        evnt={[lasEle(patnam)]}
        titl="Event"
      />
    </>
  );
};

// lasEle returns the last path element of the current page's URL, where the
// page is supposed to be the event page compliant with the following format.
//
//     /event/1698943315449571
//
const lasEle = function (str: string): string {
  const spl = str.split('/');

  if (spl.length >= 2 && spl[spl.length - 2] === "event") {
    return spl[spl.length - 1];
  }

  return "";
}
