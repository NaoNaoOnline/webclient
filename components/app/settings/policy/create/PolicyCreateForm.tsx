import { useRef, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

import { useAccount, useDisconnect } from "wagmi";

import ErrorToast from "@/components/app/toast/ErrorToast";
import ProgressToast from "@/components/app/toast/ProgressToast";
import SuccessToast from "@/components/app/toast/SuccessToast";

import { PolicySearchResponse } from "@/modules/api/policy/search/Response";

import Errors from "@/modules/errors/Errors";

interface Props {
  done: (pol: PolicySearchResponse) => void;
}

export default function PolicyCreateForm(props: Props) {
  const { user } = useUser();
  const { disconnect } = useDisconnect();

  const [cmpl, setCmpl] = useState<number>(0);
  const [cncl, setCncl] = useState<boolean>(false);
  const [erro, setErro] = useState<Errors[]>([]);
  const [sbmt, setSbmt] = useState<boolean[]>([]);
  const [wllt, setWllt] = useState<PolicySearchResponse | null>(null);

  const clld = useRef(false);

  const policyCreate = async () => {
    setCmpl(10);
    setCncl(false);
    setSbmt((old: boolean[]) => [...old, true]);

    try {
      setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      // TODO smart contract interaction

      setCmpl(100);
      await new Promise(r => setTimeout(r, 200));
      disconnect();
      clld.current = false;

    } catch (err) {
      setCmpl(0);
      setCncl(true);
      setErro((old: Errors[]) => [...old, new Errors("Holy moly, some things ain't right around the dam!", err as Error)]);
      disconnect();
      clld.current = false;
    }
  };

  // TODO policy creation should not solely be based on a wallet connecting
  useAccount({
    async onConnect({ isReconnected }) {
      if (clld.current || isReconnected) return;

      try {
        clld.current = true;

        policyCreate();

      } catch (err) {
        setErro((old: Errors[]) => [...old, new Errors("Holy moly, some things ain't right around the dam!", err as Error)]);
        disconnect();
        clld.current = false;
      }
    },
  });

  return (
    <>
      {sbmt.map((x, i) => (
        <ProgressToast
          key={i}
          cmpl={cmpl}
          cncl={cncl}
          desc="Adding New Policy"
          done={() => {
            if (wllt) props.done(wllt);
          }}
        />
      ))}

      {erro.map((x, i) => (
        <ErrorToast
          key={i}
          erro={x}
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
