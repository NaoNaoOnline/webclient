import { usePathname } from "next/navigation";

import { LabelOverview } from "@/components/app/label/LabelOverview";
import { PageHeader } from "@/components/app/layout/PageHeader";

import { LastElement } from "@/modules/path/LastElement";

export default function Page() {
  const path: string = usePathname();
  const user: string = LastElement(path);

  return (
    <>
      <PageHeader titl="User Profile" />

      <LabelOverview
        user={user}
      />
    </>
  );
};
