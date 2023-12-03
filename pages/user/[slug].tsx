import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserIcon } from "@heroicons/react/24/outline";

import { PremiumButton } from "@/components/app/button/PremiumButton";
import { ListHeader } from "@/components/app/layout/ListHeader";
import { ListSeparator } from "@/components/app/layout/ListSeparator";
import { PageHeader } from "@/components/app/layout/PageHeader";
import { RowGrid } from "@/components/app/layout/RowGrid";

import { UserSearch } from "@/modules/api/user/search/Search";
import { UserSearchResponse } from "@/modules/api/user/search/Response";
import { LastElement } from "@/modules/path/LastElement";

export default function Page() {
  const [user, setUser] = useState<UserSearchResponse | null>(null);

  const name: string = LastElement(usePathname());

  const clld = useRef(false);

  useEffect(() => {
    if (clld.current) {
      return;
    }

    {
      clld.current = true;
    }

    const getData = async () => {
      try {
        const [use]: UserSearchResponse[] = await UserSearch([{ user: "", name: name, self: false }]);
        setUser(use);
      } catch (err) {
        console.error(err);
      }
    };

    {
      getData();
    }
  }, []);

  return (
    <>
      <PageHeader titl="User Profile" />

      {user ? (
        <ListHeader
          icon={
            <Image
              alt="profile picture"
              className="w-5 h-5 rounded-full"
              height={20}
              width={20}
              src={user.imag}
            />
          }
          titl={
            <PremiumButton
              name={user.name}
              prem={user.prem}
            />
          }
        />
      ) : (
        <ListHeader
          icon={<UserIcon />}
          titl={<>{name}</>}
        />
      )}

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
              href={"/event/user/" + encodeURIComponent(name)}
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
              href={"/event/like/" + encodeURIComponent(name)}
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
              href={"/label/user/" + encodeURIComponent(name)}
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
              href={"/list/user/" + encodeURIComponent(name)}
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
