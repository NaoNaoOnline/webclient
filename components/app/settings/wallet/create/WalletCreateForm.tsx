import { useRef, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { recoverPublicKey } from "viem";
import { hashMessage } from "viem";

import ErrorToast from "@/components/app/toast/ErrorToast";
import ProgressToast from "@/components/app/toast/ProgressToast";
import SuccessToast from "@/components/app/toast/SuccessToast";

import { WalletCreate } from "@/modules/api/wallet/create/Create";
import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";
import { WalletUpdate } from "@/modules/api/wallet/update/Update";

import Errors from "@/modules/errors/Errors";

interface Props {
  atkn: string;
  done: (wal: WalletSearchResponse) => void;
  wllt: WalletSearchResponse[] | null;
}

export default function WalletCreateForm(props: Props) {
  const { user } = useUser();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [cmpl, setCmpl] = useState<number>(0);
  const [cncl, setCncl] = useState<boolean>(false);
  const [erro, setErro] = useState<Errors[]>([]);
  const [sbmt, setSbmt] = useState<boolean[]>([]);
  const [wllt, setWllt] = useState<WalletSearchResponse | null>(null);

  const clld = useRef(false);

  const walletCreate = async (mess: string, pubk: string, sign: string, addr: string) => {
    setCmpl(10);
    setCncl(false);
    setSbmt((old: boolean[]) => [...old, true]);

    try {
      setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [wal] = await WalletCreate([{ atkn: props.atkn, kind: "eth", mess: mess, pubk: pubk, sign: sign }]);

      setWllt({
        // intern
        crtd: wal.crtd,
        last: wal.crtd,
        user: user?.uuid || "",
        wllt: wal.wllt,
        // public
        addr: addr,
        kind: "eth",
      });

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

  const walletUpdate = async (mess: string, pubk: string, sign: string, addr: string, curr: WalletSearchResponse) => {
    setCmpl(10);
    setCncl(false);
    setSbmt((old: boolean[]) => [...old, true]);

    try {
      setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [sta] = await WalletUpdate([{ atkn: props.atkn, mess: mess, pubk: pubk, sign: sign, wllt: curr.wllt }]);

      setWllt({
        // intern
        crtd: curr.crtd,
        last: Math.floor(Date.now() / 1000).toString(),
        user: curr.user,
        wllt: curr.wllt,
        // public
        addr: curr.addr,
        kind: curr.kind,
      });

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

  useAccount({
    async onConnect({ address, isReconnected }) {
      if (clld.current || isReconnected) return;

      const curr = props.wllt?.find((x) => x.addr === (address as string));

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
          desc="Adding New Wallet"
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
          desc="Lecko Mio, the wallet's in pirate!"
        />
      )}
    </>
  );
};

// The below code is copied from the connectkit source code since it does not
// look like they export the function to truncate addresses at this point.

const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

const truncateEthAddress = (address?: string, separator: string = '••••') => {
  if (!address) return '';
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}${separator}${match[2]}`;
};

const rawMes = (add: string) => {
  return `signing ownership of ${add} at ${Math.floor(Date.now() / 1000)}`;
};
