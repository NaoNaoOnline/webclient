import { usePathname } from "next/navigation";

import { RiListUnordered } from "react-icons/ri";

import { ListHeader } from "@/components/app/layout/ListHeader";
import { ListSeparator } from "@/components/app/layout/ListSeparator";
import { PageHeader } from "@/components/app/layout/PageHeader";
import { ListOverview } from "@/components/app/list/ListOverview";

import { LastElement } from "@/modules/path/LastElement";

export default function Page() {
  const path: string = usePathname();
  const user: string = LastElement(path);

  return (
    <>
      <PageHeader titl="User Profile" />

      <ListHeader
        icon={<RiListUnordered />}
        titl="Lists"
      />

      <ListSeparator />

      <ListOverview
        user={user}
      />
    </>
  );
};
