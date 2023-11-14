import { memo, useRef } from "react";

import { signMessage } from "@wagmi/core";
import { hashMessage, recoverPublicKey } from "viem";

import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { useAuth } from "@/components/app/auth/AuthProvider";

import { WalletCreate } from "@/modules/api/wallet/create/Create";
import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";
import { WalletUpdate } from "@/modules/api/wallet/update/Update";

import { truncateEthAddress } from "@/modules/wallet/Address";
import { WalletUpdateRequest } from "@/modules/api/wallet/update/Request";

interface Props {
  actv: boolean;
  addr: string;
  done: (wal: WalletSearchResponse) => void;
  fail: () => void;
  wllt: WalletSearchResponse[] | null;
}

const WalletCreateForm = memo((props: Props) => {
  const { atkn, uuid } = useAuth();
  const { addErro, addPgrs, addScss } = useToast();

  const clld = useRef(false);

  const walletSign = async () => {
    const curr = props.wllt?.find((x) => x.public.addr === (props.addr as string));

    try {
      const mess = rawMes(truncateEthAddress(props.addr));
      const sign = await signMessage({ message: mess });
      const hash = hashMessage(mess);

      const pubk = await recoverPublicKey({
        hash: hash,
        signature: sign,
      });

      if (!curr) {
        await walletCreate(mess, pubk, sign, props.addr);
      } else {
        await walletUpdateSign(mess, pubk, sign, props.addr, curr);
      }
    } catch (err) {
      addErro(new ErrorPropsObject("Holy moly, some things ain't right around the dam!", err as Error));
      props.fail();
      clld.current = false;
    }
  };

  const walletCreate = async (mess: string, pubk: string, sign: string, addr: string) => {
    const pgrs: ProgressPropsObject = new ProgressPropsObject("Adding New Wallet");
    const scss: SuccessPropsObject = new SuccessPropsObject("Lecko Mio, the wallet's in pirate!");

    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [wal] = await WalletCreate([{ atkn: atkn, kind: "eth", mess: mess, pubk: pubk, sign: sign }]);

      const newWllt = {
        intern: {
          addr: {
            time: wal.crtd,
          },
          crtd: wal.crtd,
          labl: {
            time: "",
          },
          user: uuid,
          wllt: wal.wllt,
        },
        public: {
          addr: addr,
          kind: "eth",
          labl: "",
        },
      };

      addScss(scss);
      pgrs.setDone(() => {
        props.done(newWllt);
        clld.current = false;
      });

    } catch (err) {
      addErro(new ErrorPropsObject("Holy moly, some things ain't right around the dam!", err as Error));
      props.fail();
      clld.current = false;
    }
  };

  const walletUpdateSign = async (mess: string, pubk: string, sign: string, addr: string, curr: WalletSearchResponse) => {
    const pgrs: ProgressPropsObject = new ProgressPropsObject("Updating Wallet");
    const scss: SuccessPropsObject = new SuccessPropsObject("Lecko Mio, the wallet's in pirate!");

    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const req: WalletUpdateRequest = {
        // local
        atkn: atkn,
        // intern
        wllt: curr.intern.wllt,
        // public
        mess: mess,
        pubk: pubk,
        sign: sign,
        // update
        oper: [],
        path: [],
        valu: [],
      };

      const [wal] = await WalletUpdate([req]);

      console.log(2, wal.intern.labl.time)

      const newWllt = {
        intern: {
          addr: {
            time: wal.intern.addr.time,
          },
          crtd: curr.intern.crtd,
          labl: {
            time: wal.intern.labl.time,
          },
          user: curr.intern.user,
          wllt: curr.intern.wllt,
        },
        public: {
          addr: curr.public.addr,
          kind: curr.public.kind,
          labl: curr.public.labl,
        },
      };

      addScss(scss);
      pgrs.setDone(() => {
        props.done(newWllt);
        clld.current = false;
      });

    } catch (err) {
      addErro(new ErrorPropsObject("Holy moly, some things ain't right around the dam!", err as Error));
      props.fail();
      clld.current = false;
    }
  };

  if (props.actv && !clld.current) {
    clld.current = true;
    walletSign();
  }

  return (<></>);
});

WalletCreateForm.displayName = "WalletCreateForm";

export { WalletCreateForm };


const rawMes = (add: string) => {
  return `signing ownership of ${add} at ${Math.floor(Date.now() / 1000)}`;
};
