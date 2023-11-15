import { memo, useEffect } from "react";

import { Address, useAccount } from "wagmi";
import { fetchBalance, prepareWriteContract, writeContract, waitForTransaction } from "@wagmi/core";
import { parseGwei } from "viem";

import { RiDeleteBinLine } from "react-icons/ri";

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
  done: () => void;
  fail: () => void;
  plcy: PolicySearchResponse;
}

const PolicyDeleteForm = memo((props: Props) => {
  const { address } = useAccount();

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
        props.fail();
        return;
      }

      pgrs.setCmpl(30);
      const pre = await prepareWriteContract({
        address: PolicyContract as Address,
        abi: PolicyABI,
        chainId: chid,
        functionName: "deleteRecord",
        args: [{ sys: Number(sys), mem: mem, acc: Number(acc) }],
      })

      pgrs.setCmpl(40);
      const { hash } = await writeContract(pre)

      pgrs.setCmpl(50);
      const tnx = await waitForTransaction({
        hash: hash,
      })

      addScss(scss);
      pgrs.setDone(() => {
      });
    } catch (err) {
      addErro(new ErrorPropsObject("Runnin' out of luck lately, the dam's about to burst!", err as Error));
      props.fail();
    }
  };

  return (
    <button
      className="outline-none invisible group-hover/RowGrid:visible"
      type="button"
      onClick={() => {
        handleSubmit(props.plcy);
      }}
    >
      <RiDeleteBinLine
        className={`
           w-5 h-5 text-gray-500 dark:text-gray-500
           hover:text-gray-900 dark:hover:text-gray-50
        `}
      />
    </button>
  );
});

PolicyDeleteForm.displayName = "PolicyDeleteForm";

export { PolicyDeleteForm };
