import Event from "@/components/app/event/Event";
import Header from "@/components/app/layout/Header";

import { useToken } from "@/components/app/token/TokenContext";

export default function Page() {
  const { atkn } = useToken();

  return (
    <>
      <Header titl="Latest Events" />

      <div className="px-2 mt-4 md:ml-64">
        <div className="px-2 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-gray-50">
            <Event
              atkn={atkn}
              rctn="page"
              strt={"0"}
              stop={"-1"}
            />
          </div>
        </div>
      </div >
    </>
  )
}
