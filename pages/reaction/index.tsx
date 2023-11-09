import { useRouter } from "next/navigation";

import { EventList } from "@/components/app/event/EventList";

import { useAuth } from "@/components/app/auth/AuthContext";

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
    <EventList
      rctn="page"
      strt={"0"}
      stop={"-1"}
    />
  )
}
