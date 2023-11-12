import { MouseEvent } from "react";

import { CgAddR } from "react-icons/cg";
import { RiHome4Line } from "react-icons/ri";
import { RiListUnordered } from "react-icons/ri";
import { RiTimeLine } from "react-icons/ri";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { useCache } from "@/components/app/cache/CacheProvider";
import { ActiveButton } from "@/components/app/sidebar/ActiveButton";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastProvider";

export const ListButtons = () => {
  const { list, user } = useCache();
  const { addInfo } = useToast();
  const { auth } = useAuth();

  const reqAuth = (str: string) => {
    return (evn: MouseEvent<HTMLAnchorElement>) => {
      if (!auth) {
        evn.preventDefault();
        addInfo(new InfoPropsObject(str));
      }
    };
  };

  return (
    <ul>
      <li>
        <ActiveButton
          href={user[0].home !== "" && user[0].home !== "/" ? "/latest" : "/"}
          text="Latest Events"
          icon={<RiTimeLine />}
        />
      </li>

      {list.map((x, i) => (
        <li key={x.list}>
          <ActiveButton
            actv={x.list === user[0].home}
            href={`/list/` + x.list}
            text={x.desc}
            icon={x.list === user[0].home ? <RiHome4Line /> : <RiListUnordered />}
          />
        </li>
      ))}

      <li>
        <ActiveButton
          href="/event/create"
          text="Add Event"
          icon={<CgAddR />}
          blue={true}
          clck={reqAuth("Join the beavers and login if you want to add a new event. Or else!")}
        />
      </li>
    </ul >
  );
};
