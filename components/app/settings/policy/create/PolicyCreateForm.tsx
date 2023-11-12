import { FormEvent, memo } from "react";

import { Address, useAccount } from "wagmi";
import { fetchBalance, prepareWriteContract, writeContract, waitForTransaction } from "@wagmi/core";
import { parseGwei } from "viem";

import { RiAddLine } from "react-icons/ri";
import { BiInfoCircle } from "react-icons/bi";

import { useCache } from "@/components/app/cache/CacheProvider";
import { TextInput } from "@/components/app/event/create/TextInput";
import { getChain, useNetwork } from "@/components/app/network/NetworkProvider";
import { ListHeader } from "@/components/app/layout/ListHeader";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { PolicyABI } from "@/modules/abi/PolicyABI";
import { PolicyContract } from "@/modules/config/config";

const PolicyCreateForm = memo(() => {
  const { address } = useAccount();

  const { addPlcy } = useCache();
  const { addErro, addInfo, addPgrs, addScss } = useToast();

  const [netw, setNetw] = useNetwork();

  const chid: number = getChain(netw)[0].id;

  const handleSubmit = async (eve: FormEvent<HTMLFormElement>) => {
    eve.preventDefault();

    if (!address) return;

    const pgrs: ProgressPropsObject = new ProgressPropsObject("Adding New Policy");
    const scss: SuccessPropsObject = new SuccessPropsObject("Locked and loaded Mr. Smith, the policy's onchain!");
    const info: InfoPropsObject = new InfoPropsObject("Got 0 ETH in that wallet. Can't fucking do it mate!");

    const frm = new FormData(eve.target as HTMLFormElement);

    const sys: string = frm.get("system-input")?.toString() || "";
    const mem: string = frm.get("member-input")?.toString() || "";
    const acc: string = frm.get("access-input")?.toString() || "";

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
        functionName: "createRecord",
        args: [{ sys: Number(sys), mem: mem, acc: Number(acc) }],
        maxFeePerGas: parseGwei("200"),
      })

      pgrs.setCmpl(40);
      const { hash } = await writeContract(pre)

      pgrs.setCmpl(50);
      const tnx = await waitForTransaction({
        hash: hash,
      })

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

      addScss(scss);
      pgrs.setDone(() => {
        addPlcy(newPlcy);
      });
    } catch (err) {
      addErro(new ErrorPropsObject("Can't fockin' doit mate, those bloody beavers I swear!", err as Error));
    }
  };

  return (
    <>
      <ListHeader
        icon={<RiAddLine />}
        titl="Add Policy"
        bttn={
          <>
            <Tooltip
              desc={
                <div>
                  <div>use <b>submit</b> to add new policies</div>
                  <div>
                    please read the&nbsp;
                    <a
                      href="https://github.com/NaoNaoOnline/contracts"
                      target="_blank"
                      className="font-bold underline decoration-dashed"
                    >
                      contracts repo
                    </a>
                  </div>
                </div>
              }
              side="left"
            >
              <BiInfoCircle
                className="w-5 h-5 text-gray-400 dark:text-gray-500"
              />
            </Tooltip>

            <button
              form="policy-create-form"
              type="submit"
              className={`
              ml-3 px-5 py-2.5 text-sm font-medium text-center rounded-lg outline-none
              disabled:text-gray-50 disabled:dark:text-gray-700 disabled:bg-gray-200 disabled:dark:bg-gray-800
              enabled:text-gray-50 enabled:dark:text-gray-50 enabled:bg-blue-600 enabled:dark:bg-blue-700
              enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800
            `}
            >
              Submit
            </button>
          </>
        }
      />

      <div className="p-3">
        <form
          id="policy-create-form"
          onSubmit={handleSubmit}
        >
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
        </form>
      </div>
    </>
  );
});

PolicyCreateForm.displayName = "PolicyCreateForm";

export { PolicyCreateForm };
