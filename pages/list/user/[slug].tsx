import { usePathname } from "next/navigation";

import { PageHeader } from "@/components/app/layout/PageHeader";
import { ListOverview } from "@/components/app/list/page/ListOverview";

import { LastElement } from "@/modules/path/LastElement";

export default function Page() {
  const path: string = usePathname();
  const user: string = LastElement(path);

  return (
    <>
      <PageHeader titl="User Profile" />

      <ListOverview
        user={user}
      />
    </>
  );
};
