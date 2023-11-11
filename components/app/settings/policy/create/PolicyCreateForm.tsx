import { MutableRefObject, useEffect, useRef } from "react";

import { Address, useAccount, useContractWrite, useDisconnect, useWaitForTransaction } from "wagmi";
import { fetchBalance, writeContract } from "@wagmi/core";
import { parseGwei } from "viem";

import { getChain, useNetwork } from "@/components/app/network/NetworkProvider";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { PolicyABI } from "@/modules/abi/PolicyABI";
import { PolicySearchResponse } from "@/modules/api/policy/search/Response";
import { PolicyContract } from "@/modules/config/config";

interface Props {
  actv: boolean;
  cncl: (info: string) => void;
  fail: (user: string, tech: Error | null) => void;
  done: (pol: PolicySearchResponse, suc: string) => void;
  form: MutableRefObject<HTMLFormElement | null>;
}

export default function PolicyCreateForm(props: Props) {
  const { disconnect } = useDisconnect();
  const { addPgrs } = useToast();

  const [netw, setNetw] = useNetwork();

  const clld = useRef(false);

  const chid = getChain(netw)[0].id;

  const pgrs: ProgressPropsObject = new ProgressPropsObject("Adding New Policy");

  let sys = "";
  let mem = "";
  let acc = "";
  if (props.form?.current) {
    const form = new FormData(props.form?.current);

    sys = form.get("system-input")?.toString() || "";
    mem = form.get("member-input")?.toString() || "";
    acc = form.get("access-input")?.toString() || "";
  }

  const { data, error: wriErr, write } = useContractWrite({
    address: PolicyContract as Address,
    abi: PolicyABI,
    chainId: chid,
    functionName: "createRecord",
    maxFeePerGas: parseGwei("200"),
  })

  const { error: waiErr, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  useAccount({
    async onConnect({ address, isReconnected }) {
      if (!props.actv || !write || clld.current || !address || isReconnected) return;

      const bal = await fetchBalance({
        address: address,
      });

      if (bal.value === BigInt(0)) {
        disconnect();
        clld.current = false;
        props.cncl("Got 0 ETH in that wallet. Can't fucking do it mate!");
        return;
      }

      clld.current = true;

      addPgrs(pgrs);

      write({
        args: [{ sys: Number(sys), mem: mem, acc: Number(acc) }],
      });
    },
  });

  useEffect(() => {
    let err: Error | null = null;
    if (waiErr) {
      err = waiErr;
    }
    if (wriErr) {
      err = wriErr;
    }

    if (err) {
      disconnect();
      clld.current = false;
      props.fail("Can't fockin' doit mate, those bloody beavers I swear!", err as Error);
    }
  }, [props, waiErr, wriErr, disconnect]);

  useEffect(() => {
    if (isSuccess) {
      const newPlcy = {
        // local
        name: "",
        // extern
        extern: [
          { chid: String(chid) },
        ],
        // intern
        user: "",
        // public
        acce: acc,
        memb: mem,
        syst: sys,
      };

      disconnect();
      clld.current = false;

      pgrs.setDone(() => {
        props.done(newPlcy, "Locked and loaded Mr. Smith, the policy's onchain!");
      });
    }
  }, [props, disconnect, isSuccess, pgrs, chid, sys, mem, acc]);

  return <></>;
};
