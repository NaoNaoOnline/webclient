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
  done: (pol: PolicySearchResponse) => void;
  form: MutableRefObject<HTMLFormElement | null>;
}

export default function PolicyCreateForm(props: Props) {
  const { disconnect } = useDisconnect();
  const { addErro, addInfo, addPgrs, addScss } = useToast();

  const [netw, setNetw] = useNetwork();

  const clld = useRef(false);

  const chid = getChain(netw)[0].id;

  const erro: ErrorPropsObject = new ErrorPropsObject("Can't fockin' doit mate, those bloody beavers I swear!");
  const pgrs: ProgressPropsObject = new ProgressPropsObject("Adding New Policy");
  const scss: SuccessPropsObject = new SuccessPropsObject("Locked and loaded Mr. Smith, the policy's onchain!");

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

      pgrs.setDone(() => {
        props.done(newPlcy);
      });

      addScss(scss);

      clld.current = false;
      disconnect();
    }
  }, [disconnect, isSuccess, chid, sys, mem, acc]);

  return <></>;
};
