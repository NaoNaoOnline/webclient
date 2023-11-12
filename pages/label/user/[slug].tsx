import { usePathname } from "next/navigation";

import { MdLabelOutline } from "react-icons/md";

import { LabelOverview } from "@/components/app/label/LabelOverview";
import { ListHeader } from "@/components/app/layout/ListHeader";
import { ListSeparator } from "@/components/app/layout/ListSeparator";
import { PageHeader } from "@/components/app/layout/PageHeader";

import { LastElement } from "@/modules/path/LastElement";

export default function Page() {
  const path: string = usePathname();
  const user: string = LastElement(path);

  return (
    <>
      <PageHeader titl="User Profile" />

      <ListHeader
        icon={<MdLabelOutline />}
        titl="Labels"
      />

      <ListSeparator />

      <LabelOverview
        user={user}
      />
    </>
  );
};
