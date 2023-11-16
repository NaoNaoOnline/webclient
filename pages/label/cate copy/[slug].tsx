import { usePathname } from "next/navigation";

import { LabelDetail } from "@/components/app/label/LabelDetail";
import { PageHeader } from "@/components/app/layout/PageHeader";

import { LastElement } from "@/modules/path/LastElement";

export default function Page() {
  const path: string = usePathname();
  const name: string = LastElement(path);

  return (
    <>
      <PageHeader titl="Label Page" />

      <LabelDetail
        kind="cate"
        name={name}
      />
    </>
  );
};
