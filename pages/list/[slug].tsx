import { usePathname } from "next/navigation";

import { EventOverview } from "@/components/app/event/EventOverview";

export default function Page() {
  const patnam = usePathname();

  return (
    <EventOverview
      list={lasEle(patnam)}
      kind="page"
      strt="0"
      stop="-1"
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
