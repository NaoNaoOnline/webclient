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
          href={"/event/user/" + encodeURIComponent(user)}
          text="Events"
        />
        <UserProfileButton
          href={"/event/like/" + encodeURIComponent(user)}
          text="Likes"
        />
        <UserProfileButton
          href={"/label/user/" + encodeURIComponent(user)}
          text="Labels"
        />
        <UserProfileButton
          href={"/list/user/" + encodeURIComponent(user)}
          text="Lists"
        />
      </div>
    </>
  )
};
