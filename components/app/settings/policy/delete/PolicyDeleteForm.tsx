import { useEffect, useMemo, useRef } from "react";

import { Address, useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { parseGwei } from "viem";

import { getChain, useNetwork } from "@/components/app/network/NetworkProvider";

import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { PolicyABI } from "@/modules/abi/PolicyABI";

import { PolicySearchResponse } from "@/modules/api/policy/search/Response";

import { PolicyContract } from "@/modules/config/config";

interface Props {
  done: (pol: PolicySearchResponse) => void;
  fail: () => void;
  plcy: PolicySearchResponse;
}

export default function PolicyCreateForm(props: Props) {
  const { addErro, addInfo, addPgrs, addScss } = useToast();

  const [netw, setNetw] = useNetwork();

  const clld = useRef(false);

  const chid = getChain(netw)[0].id;

  const pgrs: ProgressPropsObject = useMemo(() => new ProgressPropsObject("Removing Policy"), []);

  let sys = "";
  let mem = "";
  let acc = "";
  if (props.plcy) {
    sys = props.plcy.syst;
    mem = props.plcy.memb;
    acc = props.plcy.acce;
  }

  const { data, error: wriErr, write } = useContractWrite({
    address: PolicyContract as Address,
    abi: PolicyABI,
    chainId: chid,
    functionName: "deleteRecord",
    maxFeePerGas: parseGwei("20"),
  })

  const { error: waiErr, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  useAccount({
    async onConnect({ address, isReconnected }) {
      if (!write || clld.current || !address || isReconnected) return;

      const bal = await fetchBalance({
        address: address,
      });

      if (bal.value === BigInt(0)) {
        addInfo(new InfoPropsObject("Got 0 ETH in that wallet. Can't fucking do it mate!"));
        props.fail();
        return;
      }

      clld.current = true;

      addPgrs(pgrs);

      write({
        args: [{ sys: sys, mem: mem, acc: acc }],
      });

      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));
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
      addErro(new ErrorPropsObject("Runnin' out of luck lately, the dam's about to burst!", err as Error));
      props.fail();
      clld.current = false;
    }
  }, [props, waiErr, wriErr, addErro]);

  useEffect(() => {
    if (isSuccess) {
      pgrs.setDone(() => {
        if (props.plcy) props.done(props.plcy);
      });

      addScss(new SuccessPropsObject("Shnitty shnitty bang bang, the policy is gone!"));

      clld.current = false;
    }
  }, [props, isSuccess, pgrs, addScss]);

  return <></>;
};
