import { memo, useEffect } from "react";

import { Address, useAccount } from "wagmi";
import { fetchBalance, prepareWriteContract, writeContract, waitForTransaction } from "@wagmi/core";
import { parseGwei } from "viem";

import { useCache } from "@/components/app/cache/CacheProvider";
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
  plcy: PolicySearchResponse | null;
}

const PolicyDeleteForm = memo((props: Props) => {
  const { address } = useAccount();

  const { remPlcy } = useCache();
  const { addErro, addInfo, addPgrs, addScss } = useToast();

  const [netw, setNetw] = useNetwork();

  const chid = getChain(netw)[0].id;

  const handleSubmit = async (pol: PolicySearchResponse) => {
    if (!address) return;

    const pgrs: ProgressPropsObject = new ProgressPropsObject("Removing Policy");
    const scss: SuccessPropsObject = new SuccessPropsObject("Shnitty shnitty bang bang, this policy is tanking!");
    const info: InfoPropsObject = new InfoPropsObject("Got 0 ETH in that wallet. Can't fucking do it mate!");

    const sys: string = pol.syst;
    const mem: string = pol.memb;
    const acc: string = pol.acce;

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

      pgrs.setCmpl(30);
      const pre = await prepareWriteContract({
        address: PolicyContract as Address,
        abi: PolicyABI,
        chainId: chid,
        functionName: "deleteRecord",
        args: [{ sys: Number(sys), mem: mem, acc: Number(acc) }],
        maxFeePerGas: parseGwei("200"),
      })

      pgrs.setCmpl(40);
      const { hash } = await writeContract(pre)

      pgrs.setCmpl(50);
      const tnx = await waitForTransaction({
        hash: hash,
      })

      addScss(scss);
      pgrs.setDone(() => {
        remPlcy(pol);
      });
    } catch (err) {
      addErro(new ErrorPropsObject("Runnin' out of luck lately, the dam's about to burst!", err as Error));
    }
  };

  useEffect(() => {
    if (props.plcy) {
      handleSubmit(props.plcy);
    }
  }, [props.plcy]);

  return <></>;
});

PolicyDeleteForm.displayName = "PolicyDeleteForm";

export { PolicyDeleteForm };
