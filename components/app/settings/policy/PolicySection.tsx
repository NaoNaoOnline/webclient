import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react";

import { ConnectKitButton } from "connectkit";

import { RiAddLine } from "react-icons/ri";
import { RiLock2Line } from "react-icons/ri";
import { RiDeleteBinLine } from "react-icons/ri";
import { RiLoopRightLine } from "react-icons/ri";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { CopyButton } from "@/components/app/button/CopyButton";
import { useCache } from "@/components/app/cache/CacheProvider";
import TextInput from "@/components/app/event/create/TextInput";
import PolicyCreateForm from "@/components/app/settings/policy/create/PolicyCreateForm";
import PolicyDeleteForm from "@/components/app/settings/policy/delete/PolicyDeleteForm";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { PolicySearchResponse } from "@/modules/api/policy/search/Response";
import { PolicyUpdate } from "@/modules/api/policy/update/Update";
import { UserSearch } from "@/modules/api/user/search/Search";
import { truncateEthAddress } from "@/modules/wallet/Address";
import { PolicySearch } from "@/modules/api/policy/search/Search";

interface Props { }

export default function PolicySection(props: Props) {
  const { atkn } = useAuth();
  const { plcy, addPlcy, remPlcy, updPlcy } = useCache();
  const { addErro, addInfo, addScss } = useToast();

  const [crea, setCrea] = useState<boolean>(false);
  const [dele, setDele] = useState<boolean>(false);
  const [dltd, setDltd] = useState<PolicySearchResponse | null>(null);
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
      <ul className="flex w-full pt-4 mt-4 border-t border-gray-300 dark:border-gray-800">
        <li className="flex flex-1 items-center p-3">
          <RiLock2Line className="w-5 h-5 text-gray-500 dark:text-gray-500" />
          <span className="flex-1 ml-3 text-gray-900 dark:text-gray-50 whitespace-nowrap">
            Platform Policies
          </span>
        </li>
        <li className="flex justify-end items-center p-3">
          <button
            onClick={(eve: MouseEvent<HTMLButtonElement>) => {
              updatePolicies();
            }}
            className="relative h-full pr-2 my-auto outline-none group"
            type="button"
          >
            <RiLoopRightLine
              className={`
                w-5 h-5 text-gray-400 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-50
                ${pntr !== "" ? "spin-slow" : ""}
              `}
            />
          </button>
        </li>
      </ul>

      {plcy.map((x, i) => (
        <ul key={i} className="flex flex-row w-full">
          <li className="flex items-center pl-3 py-3 rounded-lg text-gray-400 dark:text-gray-500">
            <span className="w-[20px] text-center text-sm font-mono">{x.syst}</span>
          </li>

          <li className="flex items-center p-3 rounded-lg text-gray-400 dark:text-gray-500">
            <span className="flex-1 w-[127px]">
              <CopyButton
                className="text-sm font-mono underline underline-offset-2 decoration-dashed"
                copy={x.memb}
                text={truncateEthAddress(x.memb)}
              />
            </span>
          </li>

          <li className="flex items-center py-3 rounded-lg text-gray-400 dark:text-gray-500">
            <span className="w-[20px] text-center text-sm font-mono">{x.acce}</span>
          </li>

          <li className="flex items-center p-3 rounded-lg text-gray-400 dark:text-gray-500">
            <span className="flex-1 w-[140px] text-right text-sm font-mono">{x.name ? x.name : x.user ? x.user : "n/a"}</span>
          </li>

          <li className="flex relative w-full items-center p-3 text-gray-400 dark:text-gray-500">
            <div className="flex-shrink-0 absolute right-0 mr-3">
              <ConnectKitButton.Custom>
                {({ isConnected, show }) => {
                  return (
                    <button
                      className="py-3 outline-none group" type="button"
                      onClick={() => {
                        if (!isConnected && show) {
                          setDele(true);
                          setDltd(x);
                          show();
                        }
                      }}
                    >
                      <RiDeleteBinLine className="w-5 h-5 mx-2 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
                    </button>
                  );
                }}
              </ConnectKitButton.Custom>
            </div>
          </li>
        </ul>
      ))}

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

            <PolicyDeleteForm
              actv={dele}
              cncl={() => {
                setDele(false);
                setDltd(null);
              }}
              dltd={dltd}
              done={() => {
                if (dltd) {
                  remPlcy(dltd);

                  setDele(false);
                  setDltd(null);

                  updatePolicies();
                }
              }}
              form={form}
            />
          </form>
        </li>
      </ul>
    </>
  )
};

// polUser augments a list of policy records with user names, given their user
// IDs, where available.
const polUser = async (pol: PolicySearchResponse[]): Promise<PolicySearchResponse[]> => {
  const usr = await UserSearch(uniUser(pol).map(x => ({ user: x, name: "", self: false })));

  pol = pol.map(x => {
    const u = usr.find(y => y.user === x.user);
    if (u) {
      return {
        ...x,
        name: u.name,
      };
    } else {
      return x;
    }
  });

  return pol;
};

// uniUser extracts unique user names from a list of policies and returns them
// as a list of strings.
function uniUser(des: PolicySearchResponse[]): string[] {
  const usr: Record<string, boolean> = {};
  const uni: string[] = [];

  for (const x of des) {
    if (!x || x.user === "") {
      continue
    }

    if (!usr[x.user]) {
      usr[x.user] = true;
      uni.push(x.user);
    }
  }

  return uni;
}
