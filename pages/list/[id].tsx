import { usePathname } from "next/navigation";

import { Event } from "@/components/app/event/Event";
import Header from "@/components/app/layout/Header";

export default function Page() {
  const patnam = usePathname();

  return (
    <>
      <Header titl="Latest Events" />

      <div className="px-2 mt-4 md:ml-64">
        <div className="px-2 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-gray-50">
            <Event
              list={lasEle(patnam)}
            />
          </div>
        </div>
      </div >
    </>
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
