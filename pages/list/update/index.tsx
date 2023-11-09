import { useRouter } from "next/navigation";

import { ListOverview } from "@/components/app/list/page/ListOverview";
import { PageHeader } from "@/components/app/layout/PageHeader";

import { useAuth } from "@/components/app/auth/AuthProvider";

export default function Page() {
  const nxtrtr = useRouter();
  const { auth } = useAuth();

  // In case unauthenticated users try to access a page that is meant to only
  // render content for authenticated users, we redirect to the generic login
  // page. We do not use info toasts since this would cause duplicated or
  // infinite re-renders based on how the webapp works right now.
  if (!auth) {
    return nxtrtr.push("/login");
  }

  return (
    <>
      <PageHeader titl="My Lists" />

      <ListOverview />
    </>
  );
};
