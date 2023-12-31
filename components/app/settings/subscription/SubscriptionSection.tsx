import { MutableRefObject, useEffect, useRef, useState } from "react";

import spacetime, { Spacetime } from "spacetime";

import { Address, useAccount } from "wagmi";
import { fetchBalance, prepareWriteContract, writeContract, waitForTransaction } from "@wagmi/core";
import { parseEther } from "viem";

import { CurrencyDollarIcon } from "@/components/app/icon/base/CurrencyDollarIcon";
import { InfoCircleIcon } from "@/components/app/icon/base/InfoCircleIcon";

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
import { SubscriptionContract } from "@/modules/config/config";
import { SubscriptionCreate } from "@/modules/api/subscription/create/Create";
import { SubscriptionSearch } from "@/modules/api/subscription/search/Search";
import { SubscriptionUpdate } from "@/modules/api/subscription/update/Update";
import { SubscriptionSearchResponse } from "@/modules/api/subscription/search/Response";
import { UserSearch } from "@/modules/api/user/search/Search";
import { WalletSearch } from "@/modules/api/wallet/search/Search";
import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";
import { ExistsSubs } from "@/modules/subscription/ExistsSubs";

export const SubscriptionSection = () => {
  const { address } = useAccount();

  const { atkn, uuid } = useAuth();

  const [crtr, setCrtr] = useState<WalletSearchResponse[]>([]);
  const [ldng, setLdng] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [pntr, setPntr] = useState<string>("");
  const [subs, setSubs] = useState<SubscriptionSearchResponse[]>([]);

  const { addErro, addInfo, addPgrs, addScss } = useToast();

  const [netw, setNetw] = useNetwork();

  const chid: number = getChain(netw)[0].id;

  const clld: MutableRefObject<boolean> = useRef(false);
  const updt: MutableRefObject<boolean> = useRef(false);

  const time: Spacetime = spacetime.now().goto("GMT");

  const ifir: boolean = firSub(subs, ldng);       // is first
  const iren: boolean = renSub(subs, time);       // is renewal
  const csub: boolean = canSub(subs, time, iren); // can subscribe

  const unix: string = subUni(time, ifir, iren);

  const handleSubmit = async (wal: WalletSearchResponse[]) => {
    if (!address) return;

    const pgrs: ProgressPropsObject = new ProgressPropsObject("Adding New Subscription");

    // rcvr is the user ID of the user receiving the premium subscription.
    // This can be the current user ID "uuid", or the ID of another user, if
    // the subscription should be gifted to someone else.
    const rcvr: string = uuid; // TODO allow people to gift subscriptions

    const addr: string[] = walAdd(wal)

    // Ensure the wallet is not empty.
    try {
      addPgrs(pgrs);

      pgrs.setCmpl(25);
      const bal = await fetchBalance({
        address: address,
      });

      if (bal.value === BigInt(0)) {
        addInfo(new InfoPropsObject("Got 0 ETH in that wallet. Can't fucking do it mate!"));
        return;
      }
    } catch (err) {
      addErro(new ErrorPropsObject("Ass down, ass down. Shit just hit the fan!", err as Error));
      return;
    }

    // Create the offchain subscription refernce first.
    let crtd: string = "";
    let suid: string = "";
    try {
      const [sub] = await SubscriptionCreate([{ atkn: atkn, crtr: addr.join(","), payr: uuid, rcvr: rcvr, unix: unix }]);
      crtd = sub.crtd
      suid = sub.subs
    } catch (err) {
      addErro(new ErrorPropsObject("Ass down, ass down. Shit just hit the fan!", err as Error));
      return;
    }

    // Create the onchain subscription refernce second.
    try {
      let fnc: string = "";
      if (addr.length === 1) fnc = "subOne";
      if (addr.length === 2) fnc = "subTwo";
      if (addr.length === 3) fnc = "subThr";

      let arg: any = [];
      if (addr.length === 1) arg = [rcvr, addr[0], unix];
      if (addr.length === 2) arg = [rcvr, addr[0], 50, addr[1], 50, unix];
      if (addr.length === 3) arg = [rcvr, addr[0], 33, addr[1], 33, addr[2], 34, unix];

      pgrs.setCmpl(30);
      const pre = await prepareWriteContract({
        address: SubscriptionContract as Address,
        abi: SubscriptionABI,
        chainId: chid,
        functionName: fnc,
        args: arg,
        value: parseEther("0.003"),
      })

      pgrs.setCmpl(40);
      const { hash } = await writeContract(pre)

      pgrs.setCmpl(50);
      const tnx = await waitForTransaction({
        hash: hash,
      })
    } catch (err) {
      addErro(new ErrorPropsObject("Ass down, ass down. Shit just hit the fan!", err as Error));
      return;
    }

    try {
      pgrs.setCmpl(75);
      await updateSubscriptions();

      const newSubs = {
        // intern
        crtd: crtd,
        fail: "",
        stts: "created",
        subs: suid,
        user: uuid,
        // public
        crtr: addr.join(","),
        payr: uuid,
        rcvr: rcvr,
        unix: unix,
      };

      pgrs.setDone(() => {
        setSubs((old: SubscriptionSearchResponse[]) => [...old, newSubs]);
      });
    } catch (err) {
      addErro(new ErrorPropsObject("Ass down, ass down. Shit just hit the fan!", err as Error));
    }
  };

  const updateSubscriptions = async () => {
    addInfo(new InfoPropsObject("Syncing state captain, this may take a moment!"));

    try {
      const [upd] = await SubscriptionUpdate([{ atkn: atkn, pntr: "", sync: "dflt" }]);
      setPntr(upd.pntr);
    } catch (err) {
      addErro(new ErrorPropsObject("Ass down, ass down. Shit just hit the fan!", err as Error));
    }
  };

  // Periodically fetch the subscription status of the subscription that is
  // currently being processed, if any. If the update pointer is empty, we do
  // nothing. If the update pointer is not empty, we use it to fetch the update
  // status again periodically, until the update process is complete.
  useEffect(() => {
    if (pntr === "") return;
    if (updt.current) return;

    updt.current = true;

    let timr: NodeJS.Timeout;

    const poll = async () => {
      try {
        const [upd] = await SubscriptionUpdate([{ atkn: atkn, pntr: pntr, sync: "dflt" }]);

        const dsrd: string = upd.pntr;

        if (dsrd !== pntr) {
          const sub = await SubscriptionSearch([{ atkn: atkn, subs: "", user: "", payr: "", rcvr: uuid }]);
          setSubs(sub);
          clearInterval(timr);
          setPntr("");

          if (ExistsSubs(sub, "success", Number(unix))) {
            addScss(new SuccessPropsObject("Enjoy your premium features, you magnificant beast!"));
          } else {
            addErro(new ErrorPropsObject("Your subscription got stuck. You need to talk to Jesus now!"));
          }

          updt.current = false;
        }
      } catch (err) {
        addErro(new ErrorPropsObject("An error occurred during polling!", err as Error));
      }
    };

    timr = setInterval(poll, 5000); // 5 seconds

    return () => {
      clearInterval(timr);
    };
  }, [pntr, atkn, unix, uuid, addErro, addScss]);

  // Fetch the list of creator wallets and augment them with the respective user
  // names.
  useEffect(() => {
    const getData = async () => {
      try {
        const sub = await SubscriptionSearch([{ atkn: atkn, subs: "", user: "", payr: "", rcvr: uuid }]);

        // The ldng state is used to identify whether we have searched for the
        // existing user subscriptions already. The alternative would be to use
        // a null based type for the list of subscription responses that we work
        // with, but this is a whole different can of worms.
        setSubs(sub);
        setLdng(false);

        const wob = await WalletSearch([{ atkn: atkn, crtr: "dflt", kind: "", wllt: "" }]);

        // Especially in the beginning it may happen that there is no event
        // creator to pay.
        if (wob.length === 0) {
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
      } catch (err) {
        console.error(err);
      }
    };

    if (!clld.current) {
      clld.current = true;
      getData();
    }
  });

  return (
    <>
      <ListHeader
        icon={<CurrencyDollarIcon />}
        titl={<>My Subscriptions</>}
        bttn={
          <>
            <Tooltip
              desc={
                <div>
                  {csub ? (
                    <>
                      <div>
                        connect your ETH wallet and
                      </div>
                      <div>
                        enable all premium features
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        you can renew your subscription
                      </div>
                      <div>
                        up to 7 days before month&apos;s end
                      </div>
                    </>
                  )}
                </div>
              }
              side="left"
            >
              <InfoCircleIcon
                className="w-5 h-5 text-gray-500 dark:text-gray-500"
              />
            </Tooltip>

            <SubscriptionButtonSubscribe
              clck={() => {
                setOpen(true);
              }}
              dsbl={!address || !csub}
            />

            <SubscriptionDialog
              clos={() => {
                setOpen(false);
              }}
              crtr={crtr}
              frst={ifir}
              mnth={subMon(time, ifir, iren)}
              open={open}
              sbmt={(wal: WalletSearchResponse[]) => {
                setOpen(false);
                handleSubmit(wal);
              }}
            />
          </>
        }
      />

      <SubscriptionOverview
        pntr={pntr}
        subs={subs}
        updt={updateSubscriptions}
      />
    </>
  );
};

// canSub expresses whether a subscription can be created or not.
const canSub = (sub: SubscriptionSearchResponse[], now: Spacetime, ren: boolean): boolean => {
  const ths: boolean = ExistsSubs(sub, "success", now.startOf("month").epoch / 1000);
  const nxt: boolean = ExistsSubs(sub, "success", now.next("month").startOf("month").epoch / 1000);

  // If no active subscription exists for this, nor next month, then you can
  // subscribe. Note that the subscription button must still be accessible in
  // case the subscription process got interrupted intermittendly. So if the
  // subscription object got created offchain, but the subscription got not yet
  // paid for onchain, then the user must still be able to write to the
  // contract. For that reason we append the third status paratemer below when
  // calling ExistsSubs.
  if (!ths && !nxt) return true;

  // If the new subscription would in fact be a renewal, and the time of the
  // renewal would be within the last 7 days of the current month, then you can
  // subscribe again.
  if (ren && lasDay(now, 7)) return true;

  return false
};

// firSub expresses whether the current user subscribes the very first time.
const firSub = (sub: SubscriptionSearchResponse[], ldn: boolean): boolean => {
  return !ldn && sub.length === 0;
};

// lasDay expresses whether the given time is within the last N days of the
// current month.
const lasDay = (now: Spacetime, day: number): boolean => {
  return now.isAfter(now.endOf("month").subtract(day, "day"));
};

// renSub expresses whether a subscription is a renewal or not. If an active
// subscription exists for the previous month, then the subscription for the
// next month will be a renewal.
const renSub = (sub: SubscriptionSearchResponse[], now: Spacetime): boolean => {
  return ExistsSubs(sub, "success", now.last("month").startOf("month").epoch / 1000);
};

// subMon returns the formatted month for which a new subscription would be,
// based on the current time and the distinction between first and consecutive
// subscriptions. If a subscription is renewing an already active subscription,
// then the new subscription is for the next month, because you renew it in
// advance. Otherwise, the new subscription is created for the current month.
const subMon = (now: Spacetime, fir: boolean, ren: boolean): string => {
  if (fir || (ren && lasDay(now, 7))) return now.next("month").format("month");
  return now.format("month")
};

// subUni returns the unix timestamp in seconds for the new subscription being
// made, based on the current time and the distinction between first and
// consecutive subscriptions.
const subUni = (now: Spacetime, fir: boolean, ren: boolean): string => {
  if (fir || (ren && lasDay(now, 7))) return String(Math.floor(now.next("month").epoch / 1000));
  return String(Math.floor(now.startOf("month").epoch / 1000));
};

const walAdd = (wal: WalletSearchResponse[]): string[] => {
  const add: string[] = [];

  for (let i = 0; i < wal.length; i++) {
    add.push(wal[i].public.addr);
  }

  return add;
};
