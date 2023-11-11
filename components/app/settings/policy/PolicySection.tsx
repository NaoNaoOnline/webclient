import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";

import { ConnectKitButton } from "connectkit";

import { RiAddLine } from "react-icons/ri";
import { RiLock2Line } from "react-icons/ri";
import { RiLoopRightLine } from "react-icons/ri";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { useCache } from "@/components/app/cache/CacheProvider";
import TextInput from "@/components/app/event/create/TextInput";
import PolicyCreateForm from "@/components/app/settings/policy/create/PolicyCreateForm";
import { PolicyOverview } from "@/components/app/settings/policy/PolicyOverview";
import { SettingsHeader } from "@/components/app/settings/SettingsHeader";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { PolicySearchResponse } from "@/modules/api/policy/search/Response";
import { PolicyUpdate } from "@/modules/api/policy/update/Update";
import { PolicySearch } from "@/modules/api/policy/search/Search";

interface Props { }

export const PolicySection = (props: Props) => {
  const { atkn } = useAuth();
  const { addPlcy, updPlcy } = useCache();
  const { addErro, addInfo, addScss } = useToast();

  const [crea, setCrea] = useState<boolean>(false);
  const [pntr, setPntr] = useState<string>("");

  const form = useRef<HTMLFormElement | null>(null);

  const handleSubmit = async (evn: FormEvent) => {
    evn.preventDefault();
  };

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
        }
      } catch (err) {
        addErro(new ErrorPropsObject("An error occurred during polling!", err as Error));
      }
    };

    timr = setInterval(poll, 5000); // 5 seconds

    return () => {
      clearInterval(timr);
    };
  }, [pntr, atkn, addErro]);

  return (
    <>
      <SettingsHeader
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

      <ul className="flex flex-row relative w-full pt-4 mt-4 border-t border-gray-300 dark:border-gray-800">
        <li className="flex items-center p-3 rounded-lg text-gray-900 dark:text-gray-50">
          <RiAddLine className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="flex-1 ml-3 whitespace-nowrap">Add Policy</span>
        </li>
      </ul>

      <ul className="flex flex-row w-full">
        <li className="flex items-center px-3 py-3 rounded-lg text-gray-400 dark:text-gray-500">
          <form ref={form} onSubmit={handleSubmit}>
            <div className="grid gap-x-4 grid-cols-12">
              <TextInput
                desc="the SMA system to add"
                maxl={10}
                minl={10}
                mono="font-mono"
                name="system"
                pldr="0"
                ptrn={`^[0-9]$`}
                span="col-span-2"
                titl="allowed is a single number"
                type="number"
              />

              <TextInput
                desc="the SMA member to add"
                maxl={42}
                minl={42}
                mono="font-mono"
                name="member"
                pldr="0xf39F••••2266"
                ptrn={`^0x[A-Fa-f0-9]{40}$`}
                span="col-span-8"
                titl="allowed is a single Ethreum address"
              />

              <TextInput
                desc="the SMA access to add"
                maxl={10}
                minl={10}
                mono="font-mono"
                name="access"
                pldr="1"
                ptrn={`^[0-9]$`}
                span="col-span-2"
                titl="allowed is a single number"
                type="number"
              />
            </div>

            <ConnectKitButton.Custom>
              {({ isConnected, show, ensName, truncatedAddress }) => {
                return (
                  <button
                    className="text-sm mt-3 font-medium rounded-lg w-full px-5 py-2.5 text-center disabled:text-gray-50 disabled:dark:text-gray-700 disabled:bg-gray-200 disabled:dark:bg-gray-800 enabled:text-gray-50 enabled:dark:text-gray-50 enabled:bg-blue-600 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-500"
                    onClick={() => {
                      if (form && form.current) {
                        if (form.current.checkValidity()) {
                          if (!isConnected) setCrea(true);
                          if (show) show();
                        }
                      }
                    }}
                  >
                    {isConnected ? ensName ?? truncatedAddress : "Add Policy"}
                  </button>
                );
              }}
            </ConnectKitButton.Custom>
          </form>
        </li>
      </ul>

      <PolicyCreateForm
        actv={crea}
        cncl={(info: string) => {
          setCrea(false);
          addInfo(new InfoPropsObject(info));
        }}
        done={(pol: PolicySearchResponse, suc: string) => {
          setCrea(false);
          addPlcy(pol);
          form.current?.reset();
          addScss(new SuccessPropsObject(suc));

          updatePolicies();
        }}
        fail={(user: string, tech: Error | null) => {
          setCrea(false);
          addErro(new ErrorPropsObject(user, tech));
        }}
        form={form}
      />
    </>
  )
};
