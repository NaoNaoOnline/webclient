import { MouseEvent, useEffect, useState } from "react";

import { RiLock2Line } from "react-icons/ri";
import { RiLoopRightLine } from "react-icons/ri";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { useCache } from "@/components/app/cache/CacheProvider";
import { PolicyCreateForm } from "@/components/app/settings/policy/create/PolicyCreateForm";
import { PolicyOverview } from "@/components/app/settings/policy/PolicyOverview";
import { ListHeader } from "@/components/app/layout/ListHeader";
import { ListSeparator } from "@/components/app/layout/ListSeparator";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { PolicyUpdate } from "@/modules/api/policy/update/Update";
import { PolicySearch } from "@/modules/api/policy/search/Search";

export const PolicySection = () => {
  const { atkn } = useAuth();
  const { updPlcy } = useCache();
  const { addErro, addInfo, addScss } = useToast();

  const [pntr, setPntr] = useState<string>("");

  // TODO move this where it can be reused and hook it up with the create and
  // delete forms.
  const updatePolicies = async () => {
    const info: InfoPropsObject = new InfoPropsObject("Syncing state captain, this may take a moment!");

    addInfo(info);

    try {
      const [upd] = await PolicyUpdate([{ atkn: atkn, pntr: "", sync: "default" }]);
      setPntr(upd.pntr);
    } catch (err) {
      addErro(new ErrorPropsObject("Oh they did it again, I mean, come on!!!", err as Error));
    }
  };

  useEffect(() => {
    if (pntr === "") return;

    let timr: NodeJS.Timeout;

    const poll = async () => {
      try {
        const [upd] = await PolicyUpdate([{ atkn: atkn, pntr: pntr, sync: "default" }]);

        const dsrd: string = upd.pntr;

        if (dsrd !== pntr) {
          const pol = await PolicySearch([{ atkn: atkn, ltst: "default" }]);
          updPlcy(pol);
          clearInterval(timr);
          setPntr("");
          addScss(new SuccessPropsObject("Good as gold, all synced up!"));
        }
      } catch (err) {
        addErro(new ErrorPropsObject("An error occurred during polling!", err as Error));
      }
    };

    timr = setInterval(poll, 5000); // 5 seconds

    return () => {
      clearInterval(timr);
    };
  }, [pntr, atkn, addErro, addScss, updPlcy]);

  return (
    <>
      <ListHeader
        icon={<RiLock2Line />}
        titl="Platform Policies"
        bttn={
          <button
            onClick={(eve: MouseEvent<HTMLButtonElement>) => {
              updatePolicies();
            }}
            className="outline-none group"
            type="button"
          >
            <RiLoopRightLine
              className={`
                w-5 h-5 text-gray-500 dark:text-gray-500
                group-hover:text-gray-900 dark:group-hover:text-gray-50
                ${pntr !== "" ? "spin-slow" : ""}
              `}
            />
          </button>
        }
      />

      <PolicyOverview />

      <ListSeparator />

      <PolicyCreateForm />
    </>
  )
};
