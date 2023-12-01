import { MutableRefObject, useEffect, useRef, useState } from "react";

import { Address, useAccount } from "wagmi";
import { fetchBalance, prepareWriteContract, writeContract, waitForTransaction } from "@wagmi/core";

import { BiInfoCircle } from "react-icons/bi";
import { BsCurrencyDollar } from "react-icons/bs";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { getChain, useNetwork } from "@/components/app/network/NetworkProvider";
import { SubscriptionButtonSubscribe } from "@/components/app/settings/subscription/button/SubscriptionButtonSubscribe";
import { SubscriptionOverview } from "@/components/app/settings/subscription/SubscriptionOverview";
import { SubscriptionDialog } from "@/components/app/settings/subscription/SubscriptionDialog";
import { ListHeader } from "@/components/app/layout/ListHeader";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { SubscriptionABI } from "@/modules/abi/SubscriptionABI";
import { FeeAddress, SubscriptionContract } from "@/modules/config/config";
import { SubscriptionSearchResponse } from "@/modules/api/subscription/search/Response";
import { UserSearch } from "@/modules/api/user/search/Search";
import { WalletSearch } from "@/modules/api/wallet/search/Search";
import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";

export const SubscriptionSection = () => {
  const { address } = useAccount();

  const { atkn, uuid } = useAuth();

  const [crea, setCrea] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [subs, setSubs] = useState<SubscriptionSearchResponse[]>([]);
  const [crtr, setCrtr] = useState<WalletSearchResponse[]>([]);

  const { addErro, addInfo, addPgrs, addScss } = useToast();

  const [netw, setNetw] = useNetwork();

  const chid: number = getChain(netw)[0].id;

  const clld: MutableRefObject<boolean> = useRef(false);

  const handleSubmit = async (wal: WalletSearchResponse[]) => {
    if (!address) return;

    const pgrs: ProgressPropsObject = new ProgressPropsObject("Adding New Subscription");
    const scss: SuccessPropsObject = new SuccessPropsObject("Enjoy your premium features, you magnificant beast!");
    const info: InfoPropsObject = new InfoPropsObject("Got 0 ETH in that wallet. Can't fucking do it mate!");

    try {
      addPgrs(pgrs);

      pgrs.setCmpl(25);
      const bal = await fetchBalance({
        address: address,
      });

      if (bal.value === BigInt(0)) {
        addInfo(info);
        return;
      }

      // rec is the user ID of the user receiving the premium subscription. This
      // can be the current user ID "uuid", or the ID of another user, if the
      // subscription should be gifted to someone else.
      const rec: string = uuid;

      const add: string[] = walAdd(wal)

      // TODO subscription timestamp
      const uni: string = "";

      let fnc: string = "";
      if (wal.length === 1) fnc = "subOne";
      if (wal.length === 2) fnc = "subTwo";
      if (wal.length === 3) fnc = "subThr";

      let arg: any = [];
      if (wal.length === 1) arg = [rec, wal[0].public.addr, uni];
      if (wal.length === 2) arg = [rec, ...mrgAlo(add, [50, 50]), uni];
      if (wal.length === 3) arg = [rec, ...mrgAlo(add, [33, 33, 34]), uni];

      pgrs.setCmpl(30);
      const pre = await prepareWriteContract({
        address: SubscriptionContract as Address,
        abi: SubscriptionABI,
        chainId: chid,
        functionName: fnc,
        args: arg,
      })

      pgrs.setCmpl(40);
      const { hash } = await writeContract(pre)

      pgrs.setCmpl(50);
      const tnx = await waitForTransaction({
        hash: hash,
      })

      // TODO
      const newSubs = {
        // intern
        crtd: "",
        fail: "",
        stts: "",
        subs: "",
        user: "",
        // public
        crtr: "",
        payr: "",
        rcvr: "",
        unix: "",
      };

      addScss(scss);
      pgrs.setDone(() => {
        setSubs((old: SubscriptionSearchResponse[]) => [...old, newSubs]);
      });
    } catch (err) {
      addErro(new ErrorPropsObject("Ass down, ass down. Shit just hit the fan!", err as Error));
    }
  };

  // Fetch the list of creator wallets and augment them with the respective user
  // names.
  useEffect(() => {
    const getData = async () => {
      try {
        const wob = await WalletSearch([{ atkn: atkn, crtr: "default", kind: "", wllt: "" }]);

        // Especially in the beginning it may happen that there is no content
        // creator to pay. As a default we use our own platform feee address.
        // This will also help during testing. Once the flywheel spins there
        // should be content creators users can pay directly and the platform
        // fee address should become irrelevant as a main beneficiary.
        if (wob.length === 0) {
          setCrtr(pltFrm(FeeAddress));
          clld.current = false;
          return;
        }

        const uob = await UserSearch(wob.map(x => ({ user: x.intern.user, name: "", self: false })));

        const aug = wob.map((x: WalletSearchResponse) => {
          const u = uob.find(y => y.user === x.intern.user);
          if (u) {
            return {
              ...x,
              intern: {
                ...x.intern,
                name: u.name,
              },
            };
          } else {
            return x;
          }
        });

        setCrtr(aug);
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
      <ListHeader
        icon={<BsCurrencyDollar />}
        titl="My Subscriptions"
        bttn={
          <>
            <Tooltip
              desc={
                <div>
                  <div>
                    connect your ETH wallet and
                  </div>
                  <div>
                    enable all premium features
                  </div>
                </div>
              }
              side="left"
            >
              <BiInfoCircle
                className="w-5 h-5 text-gray-500 dark:text-gray-500"
              />
            </Tooltip>

            <SubscriptionButtonSubscribe
              clck={() => {
                setOpen(true);
              }}
              dsbl={!address}
            />

            <SubscriptionDialog
              clos={() => {
                setOpen(false);
              }}
              open={open}
              sbmt={(wal: WalletSearchResponse[]) => {
                handleSubmit(wal);
              }}
              crtr={crtr}
            />
          </>
        }
      />

      <SubscriptionOverview />
    </>
  );
};

// mrgAlo merges creator addresses and their respective allocations. Consider
// two lists, ["foo", "bar", "baz"] and [20, 50, 30]. The result should be the
// following.
//
//     ["foo", 20, "bar", 50, "baz", 30]
//
const mrgAlo = (cre: string[], alo: number[]): any[] => {
  if (cre.length !== alo.length) return [];

  const mrg: any[] = [];

  for (let i = 0; i < cre.length; i++) {
    mrg.push(cre[i], alo[i]);
  }

  return mrg;
};

const pltFrm = (add: string[]): WalletSearchResponse[] => {
  const wal: WalletSearchResponse[] = [];

  for (let i = 0; i < add.length; i++) {
    wal.push({
      intern: {
        addr: {
          time: "",
        },
        crtd: "",
        labl: {
          time: "",
        },
        name: "Platform",
        user: "1",
        wllt: "",
      },
      public: {
        addr: add[i],
        kind: "",
        labl: "",
      },
    });
  }

  return wal;
};

const walAdd = (wal: WalletSearchResponse[]): string[] => {
  const add: string[] = [];

  for (let i = 0; i < wal.length; i++) {
    add.push(wal[i].public.addr);
  }

  return add;
};
