import { MutableRefObject, useEffect, useRef, useState } from "react";

import { useAccount } from "wagmi";

import { GoDotFill } from "react-icons/go";
import { RiDeleteBinLine } from "react-icons/ri";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { CopyButton } from "@/components/app/button/CopyButton";
import { useCache } from "@/components/app/cache/CacheProvider";
import { PolicyDeleteForm } from "@/components/app/settings/policy/delete/PolicyDeleteForm";
import { SettingsGrid } from "@/components/app/settings/SettingsGrid";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { useToast } from "@/components/app/toast/ToastProvider";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { PolicySearchResponse } from "@/modules/api/policy/search/Response";
import { PolicyUpdate } from "@/modules/api/policy/update/Update";
import { UserSearch } from "@/modules/api/user/search/Search";
import { truncateEthAddress } from "@/modules/wallet/Address";
import { PolicySearch } from "@/modules/api/policy/search/Search";

export const PolicyOverview = () => {
  const { plcy, remPlcy } = useCache();

  const [dltd, setDltd] = useState<PolicySearchResponse | null>(null);
  const [wusr, setWusr] = useState<PolicySearchResponse[]>([]);

  const clld: MutableRefObject<boolean> = useRef(false);

  // Augment a list of policy records with user names, given their user IDs,
  // where available.
  useEffect(() => {
    const getData = async () => {
      try {
        const usr = await UserSearch(uniUser(plcy).map(x => ({ user: x, name: "", self: false })));

        const aug = plcy.map(x => {
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

        setWusr(aug);
        clld.current = false;
      } catch (err) {
        console.error(err);
      }
    };

    if (!clld.current) {
      clld.current = true;
      getData();
    }
  }, [plcy]);

  return (
    <>
      {wusr?.map((x, i) => (
        <SettingsGrid
          key={i}
          subj={
            <div className="flex w-full">
              <div
                className="flex-1 basis-2/4 mr-6 md:mr-3"
              >
                <CopyButton
                  className="text-sm font-mono underline underline-offset-2 decoration-dashed"
                  copy={x.memb}
                  text={truncateEthAddress(x.memb)}
                />
              </div>
              <div
                className="flex-1 basis-1/4 text-sm font-mono"
              >
                S {x.syst}
              </div>
              <div
                className="flex-1 basis-1/4 text-sm font-mono"
              >
                A {x.acce}
              </div>
            </div>
          }
          midl={
            <span className="text-sm font-mono">
              {x.name ? x.name : x.user ? x.user : "n/a"}
            </span>
          }
          rigt={
            <button
              className="outline-none group"
              type="button"
              onClick={() => {
                setDltd(x);
              }}
            >
              <RiDeleteBinLine
                className={`
                   w-5 h-5 text-gray-500 dark:text-gray-500
                   group-hover:text-gray-900 dark:group-hover:text-gray-50
                `}
              />
            </button>
          }
        />
      ))}

      <PolicyDeleteForm
        done={(pol: PolicySearchResponse) => {
          setDltd(null);
          remPlcy(pol);
        }
        }
        fail={() => {
          setDltd(null);
        }}
        plcy={dltd}
      />
    </>
  )
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
