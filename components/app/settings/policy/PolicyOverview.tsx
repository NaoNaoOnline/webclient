import { MutableRefObject, useEffect, useRef, useState } from "react";

import { useAccount } from "wagmi";

import { GoDotFill } from "react-icons/go";
import { RiDeleteBinLine } from "react-icons/ri";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { CopyButton } from "@/components/app/button/CopyButton";
import { useCache } from "@/components/app/cache/CacheProvider";
import PolicyDeleteForm from "@/components/app/settings/policy/delete/PolicyDeleteForm";
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
  const { address } = useAccount();

  const { atkn } = useAuth();
  const { plcy, remPlcy, updPlcy } = useCache();
  const { addErro, addInfo } = useToast();

  const [dltd, setDltd] = useState<PolicySearchResponse | null>(null);
  const [pntr, setPntr] = useState<string>("");
  const [wusr, setWusr] = useState<PolicySearchResponse[]>([]);

  const clld: MutableRefObject<boolean> = useRef(false);

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
  }, []);

  return (
    <>
      {wusr?.map((x, i) => (
        <SettingsGrid
          key={i}
          icon={
            <Tooltip
              desc={
                <div>
                  <div>currently connected wallet</div>
                  <div>click to copy full address</div>
                </div>
              }
              side="left"
              vsbl={x.memb === String(address)}
            >
              <GoDotFill
                className="fill-green-400"
              />
            </Tooltip>
          }
          subj={
            <CopyButton
              className="text-sm font-mono underline underline-offset-2 decoration-dashed"
              copy={x.memb}
              text={truncateEthAddress(x.memb)}
            />
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

      {dltd && (
        <PolicyDeleteForm
          done={() => {
            if (dltd) {
              remPlcy(dltd);
              setDltd(null);
              updatePolicies();
            }
          }}
          fail={() => {
            setDltd(null);
          }}
          plcy={dltd}
        />
      )}
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
