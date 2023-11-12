import { usePathname } from "next/navigation";

import { EventList } from "@/components/app/event/EventList";

export default function Page() {
  const patnam = usePathname();

  return (
    <EventList
      list={lasEle(patnam)}
    />
  );
};

// lasEle returns the last path element of the current page's URL, where the
// page is supposed to be the list page compliant with the following format.
//
//     /list/1698943315449571
//
const lasEle = function (str: string): string {
  const spl = str.split('/');

  if (spl.length >= 2 && spl[spl.length - 2] === "list") {
    return spl[spl.length - 1];
  }

  return "";
}
