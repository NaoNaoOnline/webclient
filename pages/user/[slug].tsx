import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserIcon } from "@heroicons/react/24/outline";

import { ListHeader } from "@/components/app/layout/ListHeader";
import { ListSeparator } from "@/components/app/layout/ListSeparator";
import { PageHeader } from "@/components/app/layout/PageHeader";

import { LastElement } from "@/modules/path/LastElement";
import { RowGrid } from "@/components/app/layout/RowGrid";

export default function Page() {
  const path: string = usePathname();
  const user: string = LastElement(path);

  return (
    <>
      <PageHeader titl="User Profile" />

      <ListHeader
        icon={<UserIcon />}
        titl={user}
      />

      <ListSeparator />

      {/*
      We keep the outer div to make the nth-child background colouring of the
      list content work properly to start at the first child. When we remove the
      outer div the ListHeader above becomes the first child and the alternating
      background colour change effectively flips.
       */}
      <div>
        <RowGrid
          list={true}
          subj={
            <Link
              href={"/event/user/" + encodeURIComponent(user)}
              className={`
                text-sm font-mono
                hover:underline hover:underline-offset-2
              `}
            >
              Events
            </Link>
          }
          midl={
            <span className="text-xs font-mono">
              events created by the user
            </span>
          }
        />

        <RowGrid
          list={true}
          subj={
            <Link
              href={"/event/like/" + encodeURIComponent(user)}
              className={`
                text-sm font-mono
                hover:underline hover:underline-offset-2
              `}
            >
              Likes
            </Link>
          }
          midl={
            <span className="text-xs font-mono">
              events liked by the user
            </span>
          }
        />

        <RowGrid
          list={true}
          subj={
            <Link
              href={"/label/user/" + encodeURIComponent(user)}
              className={`
                text-sm font-mono
                hover:underline hover:underline-offset-2
              `}
            >
              Labels
            </Link>
          }
          midl={
            <span className="text-xs font-mono">
              labels created by the user
            </span>
          }
        />

        <RowGrid
          list={true}
          subj={
            <Link
              href={"/list/user/" + encodeURIComponent(user)}
              className={`
                text-sm font-mono
                hover:underline hover:underline-offset-2
              `}
            >
              Lists
            </Link>
          }
          midl={
            <span className="text-xs font-mono">
              lists created by the user
            </span>
          }
        />
      </div>
    </>
  )
};
