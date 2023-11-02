import { MutableRefObject, useEffect, useRef } from "react";

import { Address, useAccount, useContractWrite, useDisconnect, useWaitForTransaction } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { parseGwei } from "viem";

import { getChain, useNetwork } from "@/components/app/network/Network";

import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastContext";

import { PolicyABI } from "@/modules/abi/PolicyABI";

import { PolicySearchResponse } from "@/modules/api/policy/search/Response";

import { PolicyContract } from "@/modules/config/config";

interface Props {
  actv: boolean;
  cncl: () => void;
  dltd: PolicySearchResponse | null;
  done: () => void;
  form: MutableRefObject<HTMLFormElement | null>;
}

export default function PolicyCreateForm(props: Props) {
  const { disconnect } = useDisconnect();
  const { addErro, addInfo, addPgrs, addScss } = useToast();

  const [netw, setNetw] = useNetwork();

  const clld = useRef(false);

  const chid = getChain(netw)[0].id;

  const erro: ErrorPropsObject = new ErrorPropsObject("Runnin' out of luck lately, the dam's about to burst!");
  const pgrs: ProgressPropsObject = new ProgressPropsObject("Removing Policy");
  const scss: SuccessPropsObject = new SuccessPropsObject("Shnitty shnitty bang bang, the policy is gone!");

  let sys = "";
  let mem = "";
  let acc = "";
  if (props.dltd) {
    sys = props.dltd.syst;
    mem = props.dltd.memb;
    acc = props.dltd.acce;
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
      if (!props.actv || !write || clld.current || !address || isReconnected) return;

      const bal = await fetchBalance({
        address: address,
      });

      if (bal.value === BigInt(0)) {
        addInfo(new InfoPropsObject("Got 0 ETH in that wallet. Can't fucking do it mate!"));
        props.cncl();
        disconnect();
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
      erro.setTech(err as Error);
      addErro(erro);
      props.cncl();
      disconnect();
      clld.current = false;
    }
  }, [props, waiErr, wriErr, disconnect]);

  useEffect(() => {
    if (isSuccess) {
      pgrs.setDone(() => {
        if (props.dltd) props.done();
      });

      addScss(scss);

      clld.current = false;
      disconnect();
    }
  }, [isSuccess, disconnect, props.dltd]);

  return <></>;
};
