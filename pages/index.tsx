import Event from "@/components/app/event/Event";
import Header from "@/components/app/layout/Header";

import spacetime from "spacetime";

export default function Page() {
  const sta: string = String(Math.floor(spacetime.now().goto("GMT").subtract(1, "week").epoch / 1000));
  const sto: string = String(Math.ceil(spacetime.now().goto("GMT").add(1, "week").epoch / 1000));

  return (
    <>
      <Header titl="Latest Events" />

      <div className="px-2 mt-4 md:ml-64">
        <div className="px-2 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-gray-50">
            <Event
              strt={sta}
              stop={sto}
              time="page"
            />
          </div>
        </div>
      </div >
    </>
  )
};
