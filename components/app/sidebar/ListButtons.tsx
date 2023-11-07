import { MouseEvent } from "react";

import { RiHeart3Line } from "react-icons/ri";
import { HomeIcon } from "@heroicons/react/24/outline";
import { RiMenuAddLine } from "react-icons/ri";
import { RiListUnordered } from "react-icons/ri";

import { useCache } from "@/components/app/cache/CacheContext";

import { ActiveButton } from "@/components/app/sidebar/ActiveButton";

import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastContext";

import { useAuth } from "@/components/app/auth/AuthContext";

export function ListButtons() {
  const { list, user } = useCache();
  const { addInfo } = useToast();
  const { auth } = useAuth();

  const newOnLinkClick = (str: string) => {
    return (evn: MouseEvent<HTMLAnchorElement>) => {
      if (!auth) {
        evn.preventDefault();
        addInfo(new InfoPropsObject(str));
      }
    };
  }

  return (
    <ul>
      <li>
        <ActiveButton
          href="/"
          icon={<HomeIcon />}
          text="Default View"
        />
      </li>

      <li>
        <ActiveButton
          href="/reaction"
          text="My Likes"
          icon={<RiHeart3Line />}
          clck={newOnLinkClick("Login if you want to see the events you reacted to. The beavers are stubborn about it!")}
        />
      </li>

      {list.map((x, i) => (
        <li key={x.list}>
          <ActiveButton
            href={`/list/` + x.list}
            text={x.desc}
            icon={x.list === user[0].home ? <HomeIcon /> : <RiListUnordered />}
          />
        </li>
      ))}

      <li>
        <ActiveButton
          href="/list/update"
          text="Manage Lists"
          icon={<RiMenuAddLine />}
          clck={newOnLinkClick("You can't come in honey, maybe login and try again, maybe, but I don't know!")}
        />
      </li>
    </ul >
  );
};
