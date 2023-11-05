import { useRouter } from "next/navigation";

import { ListOverview } from "@/components/app/list/ListOverview";
import Header from "@/components/app/layout/Header";

import { useToken } from "@/components/app/token/TokenContext";

export default function Page() {
  const nxtrtr = useRouter();
  const { auth } = useToken();

  // In case unauthenticated users try to access a page that is meant to only
  // render content for authenticated users, we redirect to the generic login
  // page. We do not use info toasts since this would cause duplicated or
  // infinite re-renders based on how the webapp works right now.
  if (!auth) {
    return nxtrtr.push("/login");
  }

  return (
    <>
      <Header titl="My Lists" />

      <div className="px-2 mt-4 md:ml-64">
        <div className="px-2 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-gray-50">
            <ListOverview />
          </div>
        </div>
      </div >
    </>
  );
};
