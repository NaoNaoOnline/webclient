import { MutableRefObject, useEffect, useRef, useState } from "react";

import { Address, useAccount, useContractWrite, useDisconnect, useWaitForTransaction } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { parseGwei } from "viem";

import { getChain, useNetwork } from "@/components/app/network/Network";

import ErrorToast from "@/components/app/toast/ErrorToast";
import InfoToast from "@/components/app/toast/InfoToast";
import ProgressToast from "@/components/app/toast/ProgressToast";
import SuccessToast from "@/components/app/toast/SuccessToast";

import { PolicyABI } from "@/modules/abi/PolicyABI";

import { PolicySearchResponse } from "@/modules/api/policy/search/Response";

import { PolicyContract } from "@/modules/config/config";

import Errors from "@/modules/errors/Errors";

interface Props {
  actv: boolean;
  done: (pol: PolicySearchResponse) => void;
  form: MutableRefObject<HTMLFormElement | null>;
}

export default function PolicyCreateForm(props: Props) {
  const { disconnect } = useDisconnect();

  const [netw, setNetw] = useNetwork();

  const [cmpl, setCmpl] = useState<number>(0);
  const [cncl, setCncl] = useState<boolean>(false);
  const [erro, setErro] = useState<Errors[]>([]);
  const [info, setInfo] = useState<boolean[]>([]);
  const [sbmt, setSbmt] = useState<boolean[]>([]);
  const [plcy, setPlcy] = useState<PolicySearchResponse | null>(null);

  const clld = useRef(false);

  const chid = getChain(netw)[0].id;

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
        setInfo((old: boolean[]) => [...old, true]);
        disconnect();
        return;
      }

      clld.current = true;

      setCmpl(10);
      setCncl(false);
      setSbmt((old: boolean[]) => [...old, true]);

      write({
        args: [{ sys: sys, mem: mem, acc: acc }],
      });

      setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      setCmpl(50);
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
      setCmpl(0);
      setCncl(true);
      setErro((old: Errors[]) => [...old, new Errors("Couldn't fockin' doit, those bloody beavers I swear!", err as Error)]);
      disconnect();
      clld.current = false;
    }
  }, [waiErr, wriErr, disconnect]);

  useEffect(() => {
    if (isSuccess) {
      setCmpl(100);
      clld.current = false;
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setPlcy({
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
      });
      disconnect();
    }
  }, [isSuccess, chid, sys, mem, acc, disconnect, setPlcy]);

  return (
    <>
      {sbmt.map((x, i) => (
        <ProgressToast
          key={i}
          cmpl={cmpl}
          cncl={cncl}
          desc="Adding New Policy"
          done={() => {
            if (plcy) props.done(plcy);
          }}
        />
      ))}

      {erro.map((x, i) => (
        <ErrorToast
          key={i}
          erro={x}
        />
      ))}

      {info.map((x, i) => (
        <InfoToast
          key={i}
          desc="Got 0 ETH in that wallet. Can't fucking do it mate!"
        />
      ))}

      {cmpl >= 100 && (
        <SuccessToast
          desc="Locked and loaded Mr. Smith, the policy's onchain!"
        />
      )}
    </>
  );
};
