import { FormEvent, useRef, useState } from "react";

import { ConnectKitButton } from "connectkit";

import { LockClosedIcon } from "@radix-ui/react-icons";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

import CopyButton from "@/components/app/button/CopyButton";

import TextInput from "@/components/app/event/add/TextInput";
import PolicyCreateForm from "@/components/app/settings/policy/create/PolicyCreateForm";

import CacheApiPolicy from "@/modules/cache/api/Policy";
import { PolicySearchResponse } from "@/modules/api/policy/search/Response";
import { UserSearch } from "@/modules/api/user/search/Search";

import { truncateEthAddress } from "@/modules/wallet/Address";

interface Props {
  atkn: string;
}

// TODO enable policy deletion
export default function PolicySection(props: Props) {
  const [clck, setClck] = useState<boolean>(false);
  const [plcy, setPlcy] = useState<PolicySearchResponse[] | null>(null);

  const clld = useRef<boolean>(false);
  const form = useRef<HTMLFormElement | null>(null);

  const caw: PolicySearchResponse[] = CacheApiPolicy(props.atkn ? true : false, props.atkn);
  if (!clld.current && caw.length !== 0 && !plcy) {
    clld.current = true;
    polUser(caw).then((x: PolicySearchResponse[]) => setPlcy((x)));
  }

  const handleSubmit = async (evn: FormEvent) => {
    evn.preventDefault();
  };

  return (
    <>
      {!plcy && (
        <></>
      )}
      {plcy && (
        <>
          <ul className="flex flex-row relative w-full pt-4 mt-4 border-t border-gray-300 dark:border-gray-800">
            <li className="flex items-center p-3 rounded-lg text-gray-900 dark:text-gray-50">
              <LockClosedIcon className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="flex-1 ml-3 whitespace-nowrap">Platform Policies</span>
            </li>
          </ul>

          {sortPlcy(plcy).map((x, i) => (
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
                <span className="flex-1 w-[140px] text-right text-sm font-mono">{x.name}</span>
              </li>

              <li className="flex relative w-full items-center p-3 text-gray-400 dark:text-gray-500">
                <div className="flex-shrink-0 absolute right-0 mr-3">
                  <button className="py-3 outline-none group" type="button">
                    <TrashIcon className="w-5 h-5 mx-2 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
                  </button>
                  {/* <WalletMenu
                    delt={() => walletDelete(x)}
                  /> */}
                </div>
              </li>
            </ul>
          ))}

          <ul className="flex flex-row relative w-full pt-4 mt-4 border-t border-gray-300 dark:border-gray-800">
            <li className="flex items-center p-3 rounded-lg text-gray-900 dark:text-gray-50">
              <PlusIcon className="flex-shrink-0 w-5 h-5 text-gray-500 dark:text-gray-400" />
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
                          setClck(true);

                          if (form && form.current) {
                            if (form.current.checkValidity()) {
                              if (!isConnected && show) {
                                show();
                              }
                            }
                          }
                        }}
                      >
                        {clck && isConnected ? ensName ?? truncatedAddress : "Add Policy"}
                      </button>
                    );
                  }}
                </ConnectKitButton.Custom>

                <PolicyCreateForm
                  actv={clck}
                  done={(pol: PolicySearchResponse) => {
                    setPlcy((old: PolicySearchResponse[] | null) => {
                      if (old === null) return [pol];

                      const ind = old.findIndex((x) => x.syst === pol.syst && x.memb === pol.memb && x.acce === pol.acce);

                      if (ind === -1) return [...old, pol];

                      const upd = [...old];
                      upd[ind] = pol;
                      return upd;
                    });
                  }}
                  form={form}
                />
              </form>
            </li>
          </ul>

        </>
      )}
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

const sortPlcy = (lis: PolicySearchResponse[]): PolicySearchResponse[] => {
  lis.sort((x: PolicySearchResponse, y: PolicySearchResponse) => {
    // Sort policies by SMA system in accending order with first priority.
    const xsy = parseInt(x.syst, 10);
    const ysy = parseInt(y.syst, 10);

    if (xsy !== ysy) {
      return xsy - ysy;
    }

    // Sort policies by SMA access in accending order with second priority.
    const xac = parseInt(x.acce, 10);
    const yac = parseInt(y.acce, 10);

    if (xac !== yac) {
      return xac - yac;
    }

    // Sort policies by SMA member in accending order with third priority.
    if (x.memb < y.memb) return -1;
    if (x.memb > y.memb) return +1;

    return 0;
  });

  return lis;
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
