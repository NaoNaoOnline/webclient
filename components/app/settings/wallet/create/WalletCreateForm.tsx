import { useRef, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { recoverPublicKey } from "viem";
import { hashMessage } from "viem";

import ErrorToast from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastContext";

import { WalletCreate } from "@/modules/api/wallet/create/Create";
import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";
import { WalletUpdate } from "@/modules/api/wallet/update/Update";

import Errors from "@/modules/errors/Errors";

import { truncateEthAddress } from "@/modules/wallet/Address";

interface Props {
  actv: boolean;
  atkn: string;
  cncl: () => void;
  done: (wal: WalletSearchResponse) => void;
  wllt: WalletSearchResponse[] | null;
}

export default function WalletCreateForm(props: Props) {
  const { user } = useUser();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { addPgrs, addScss } = useToast();

  const [erro, setErro] = useState<Errors[]>([]);

  const clld = useRef(false);

  const walletCreate = async (mess: string, pubk: string, sign: string, addr: string) => {
    const pgrs: ProgressPropsObject = new ProgressPropsObject("Adding New Wallet");
    const scss: SuccessPropsObject = new SuccessPropsObject("Lecko Mio, the wallet's in pirate!");

    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [wal] = await WalletCreate([{ atkn: props.atkn, kind: "eth", mess: mess, pubk: pubk, sign: sign }]);

      const newWllt = {
        intern: {
          addr: {
            time: wal.crtd,
          },
          crtd: wal.crtd,
          user: user?.intern?.uuid || "",
          wllt: wal.wllt,
        },
        public: {
          addr: addr,
          kind: "eth",
        },
      };

      pgrs.setDone(() => {
        props.done(newWllt);
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

      disconnect();
      clld.current = false;

    } catch (err) {
      setErro((old: Errors[]) => [...old, new Errors("Holy moly, some things ain't right around the dam!", err as Error)]);
      props.cncl();
      disconnect();
      clld.current = false;
    }
  };

  const walletUpdate = async (mess: string, pubk: string, sign: string, addr: string, curr: WalletSearchResponse) => {
    const pgrs: ProgressPropsObject = new ProgressPropsObject("Updating Wallet");
    const scss: SuccessPropsObject = new SuccessPropsObject("Lecko Mio, the wallet's in pirate!");

    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [wal] = await WalletUpdate([{ atkn: props.atkn, mess: mess, pubk: pubk, sign: sign, wllt: curr.intern.wllt }]);

      const newWllt = {
        intern: {
          addr: {
            time: wal.intern.addr.time,
          },
          crtd: curr.intern.crtd,
          user: curr.intern.user,
          wllt: curr.intern.wllt,
        },
        public: {
          addr: curr.public.addr,
          kind: curr.public.kind,
        },
      };

      pgrs.setDone(() => {
        props.done(newWllt);
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));
      disconnect();
      clld.current = false;

    } catch (err) {
      setErro((old: Errors[]) => [...old, new Errors("Holy moly, some things ain't right around the dam!", err as Error)]);
      props.cncl();
      disconnect();
      clld.current = false;
    }
  };

  useAccount({
    async onConnect({ address, isReconnected }) {
      if (!props.actv || clld.current || isReconnected) return;

      const curr = props.wllt?.find((x) => x.public.addr === (address as string));

      try {
        clld.current = true;

        const mess = rawMes(truncateEthAddress(address));
        const sign = await signMessageAsync({ message: mess });
        const hash = hashMessage(mess);

        const pubk = await recoverPublicKey({
          hash: hash,
          signature: sign,
        });

        if (!curr) {
          walletCreate(mess, pubk, sign, address as string);
        } else {
          walletUpdate(mess, pubk, sign, address as string, curr);
        }
      } catch (err) {
        setErro((old: Errors[]) => [...old, new Errors("Holy moly, some things ain't right around the dam!", err as Error)]);
        props.cncl();
        disconnect();
        clld.current = false;
      }
    },
  });

  return (
    <>
      {erro.map((x, i) => (
        <ErrorToast
          key={i}
          erro={x}
        />
      ))}
    </>
  );
};

const rawMes = (add: string) => {
  return `signing ownership of ${add} at ${Math.floor(Date.now() / 1000)}`;
};
