import { usePathname } from "next/navigation";

import { PageHeader } from "@/components/app/layout/PageHeader";
import { UserProfileButton } from "@/components/app/user/UserProfileButton";

import { LastElement } from "@/modules/path/LastElement";

export default function Page() {
  const path: string = usePathname();

  const user: string = LastElement(path);

  return (
    <>
      <PageHeader titl="User Profile" />

      <div className="grid grid-cols-2 gap-4">
        <UserProfileButton
          href={"/event/user/" + user}
          text="Events"
        />
        <UserProfileButton
          href={"/event/like/" + user}
          text="Likes"
        />
        <UserProfileButton
          href={"/label/user/" + user}
          text="Labels"
        />
        <UserProfileButton
          href={"/list/user/" + user}
          text="Lists"
        />
      </div>
    </>
  )
};
