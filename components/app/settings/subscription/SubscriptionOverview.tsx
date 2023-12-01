import { MutableRefObject, useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { RowGrid } from "@/components/app/layout/RowGrid";

import { SubscriptionSearchResponse } from "@/modules/api/subscription/search/Response";
import { SubscriptionSearch } from "@/modules/api/subscription/search/Search";

export const SubscriptionOverview = () => {
  const { atkn, uuid } = useAuth();

  const [subs, setSubs] = useState<SubscriptionSearchResponse[]>([]);

  const clld: MutableRefObject<boolean> = useRef(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const sub = await SubscriptionSearch([{ atkn: atkn, subs: "", user: "", payr: "", rcvr: uuid }]);

        setSubs(sub);
        clld.current = false;
      } catch (err) {
        console.error(err);
      }
    };

    if (!clld.current) {
      clld.current = true;
      getData();
    }
  }, []);

  return (
    <>
      {subs?.map((x, i) => (
        <RowGrid
          key={i}
          list={true}
          subj={
            <div >
              TODO
            </div>
          }
        />
      ))}
    </>
  )
};
