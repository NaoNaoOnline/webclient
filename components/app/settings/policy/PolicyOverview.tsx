import { MutableRefObject, useEffect, useRef, useState } from "react";

import { DotFullFillIcon } from "@/components/app/icon/base/DotFullFillIcon";

import { CopyButton } from "@/components/app/button/CopyButton";
import { useCache } from "@/components/app/cache/CacheProvider";
import { PolicyDeleteForm } from "@/components/app/settings/policy/delete/PolicyDeleteForm";
import { RowGrid } from "@/components/app/layout/RowGrid";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { PolicySearchResponse } from "@/modules/api/policy/search/Response";
import { UserSearch } from "@/modules/api/user/search/Search";
import { truncateEthAddress } from "@/modules/wallet/Address";

export const PolicyOverview = () => {
  const { plcy, remPlcy, hasMemb } = useCache();

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
        <RowGrid
          key={i}
          list={true}
          icon={
            <Tooltip
              desc={
                <div>
                  <div>your active permission</div>
                  <div>for content moderation</div>
                </div>
              }
              side="left"
              vsbl={hasMemb(x.memb)}
            >
              <DotFullFillIcon
                className="fill-rose-600"
              />
            </Tooltip>
          }
          subj={
            <div className="flex w-full">
              <div
                className="flex-1 basis-2/4 mr-6 md:mr-3"
              >
                <CopyButton
                  className={`
                    text-sm font-mono
                    hover:underline hover:underline-offset-2 hover:decoration-dashed
                  `}
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
            <PolicyDeleteForm
              done={() => {
                remPlcy(x);
              }}
              fail={() => {
              }}
              plcy={x}
            />
          }
        />
      ))}
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
