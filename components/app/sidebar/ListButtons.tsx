import { MouseEvent } from "react";

import { CgAddR } from "react-icons/cg";
import { RiHome4Line } from "react-icons/ri";
import { RiListUnordered } from "react-icons/ri";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { NaoNaoIcon } from "@/components/app/icon/NaoNaoIcon";
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
          href={user?.home === "" || user?.home === "/" ? "/" : "/event/latest"}
          text={<>NaoNao</>}
          icon={<NaoNaoIcon className="rounded-none" />}
        />
      </li>

      {list.map((x, i) => (
        <li key={x.list}>
          <ActiveButton
            actv={x.list === user?.home}
            href={`/list/` + x.list}
            text={<>{x.desc}</>}
            icon={x.list === user?.home ? <RiHome4Line /> : <RiListUnordered />}
          />
        </li>
      ))}

      <li>
        <ActiveButton
          href="/event/create"
          text={<>Add Event</>}
          icon={<CgAddR />}
          blue={true}
          clck={reqAuth("Join the beavers and login if you want to add a new event. Or else!")}
        />
      </li>
    </ul >
  );
};
