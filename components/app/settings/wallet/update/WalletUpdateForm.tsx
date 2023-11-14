import { memo, useState } from "react";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { LabelButton } from "@/components/app/button/LabelButton";
import { WalletLabelDialog } from "@/components/app/settings/wallet/update/WalletLabelDialog";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";
import { WalletUpdate } from "@/modules/api/wallet/update/Update";
import { WalletUpdateRequest } from "@/modules/api/wallet/update/Request";
import { WalletLabelAccounting, WalletLabelModeration, WalletLabelUnassigned } from "@/modules/wallet/Label";
import { hasLabl } from "@/components/app/cache/CacheProvider";

interface Props {
  done: (wal: WalletSearchResponse) => void;
  fail: () => void;
  hacc: boolean; // user has accounting wallet
  wllt: WalletSearchResponse;
}

const WalletUpdateForm = memo((props: Props) => {
  const { atkn } = useAuth();
  const { addErro, addPgrs, addScss } = useToast();

  const [open, setOpen] = useState<boolean>(false);

  const walletUpdateLabl = async (lab: string) => {
    const pgrs: ProgressPropsObject = new ProgressPropsObject("Updating Wallet");
    const scss: SuccessPropsObject = new SuccessPropsObject("Best label ever, mi amor!");

    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      // Every time a user selects an option for the wallet designation we
      // submit a list of patch updates in order to reflect the desired outcome
      // of the user's label choice. The value given in the current callback is
      // the value selected, the new desired wallet label. The values currently
      // set in the given wallet object, 0 to 1, need to be removed. If the
      // given wallet object does not define any existing label, we do not need
      // to remove any.
      const req: WalletUpdateRequest = {
        // local
        atkn: atkn,
        // intern
        wllt: props.wllt.intern.wllt,
        // public
        mess: "",
        pubk: "",
        sign: "",
        // update
        oper: ["add"],
        path: ["-"],
        valu: [lab],
      };

      const curr: string[] = props.wllt.public.labl.split(",");

      for (const x of curr) {
        const ind: number = curr.findIndex((y: string) => x === y && x !== lab)

        if (x !== "" && ind !== -1) {
          req.oper.push("remove");
          req.path.push(String(ind));
          req.valu.push(x);
        }
      }

      const [wal] = await WalletUpdate([req]);

      const newWllt = {
        intern: {
          addr: {
            time: wal.intern.addr.time,
          },
          crtd: props.wllt.intern.crtd,
          labl: {
            time: wal.intern.labl.time,
          },
          user: props.wllt.intern.user,
          wllt: props.wllt.intern.wllt,
        },
        public: {
          addr: props.wllt.public.addr,
          kind: props.wllt.public.kind,
          labl: lab,
        },
      };

      addScss(scss);
      pgrs.setDone(() => {
        props.done(newWllt);
        setOpen(false);
      });

    } catch (err) {
      addErro(new ErrorPropsObject("What do senpai, the beavers took completely over!", err as Error));
      props.fail();
    }
  };

  const acc: boolean = hasLabl(props.wllt, WalletLabelAccounting);
  const mod: boolean = hasLabl(props.wllt, WalletLabelModeration);

  return (
    <>
      {acc && (
        labAcc(() => {
          setOpen(true);
        })
      )}
      {mod && (
        labMod(() => {
          setOpen(true);
        })
      )}
      {!acc && !mod && (
        labNon(() => {
          setOpen(true);
        })
      )}

      <WalletLabelDialog
        open={open}
        hacc={props.hacc}
        clos={() => {
          setOpen(false);
        }}
        sbmt={(lab: string) => {
          walletUpdateLabl(lab);
        }}
        wllt={props.wllt}
      />
    </>
  );
});

WalletUpdateForm.displayName = "WalletUpdateForm";

export { WalletUpdateForm };

const labAcc = (clck: () => void) => {
  return (
    <Tooltip
      desc={
        <div>
          <div>this wallet is used</div>
          <div>for revenue sharing</div>
        </div>
      }
      side="right"
    >
      <LabelButton
        clck={clck}
        blue={true}
        text={WalletLabelAccounting.toLocaleUpperCase()}
      />
    </Tooltip>
  );
};

const labMod = (clck: () => void) => {
  return (
    <Tooltip
      desc={
        <div>
          <div>this wallet is used</div>
          <div>for content moderation</div>
        </div>
      }
      side="right"
    >
      <LabelButton
        clck={clck}
        rose={true}
        text={WalletLabelModeration.toLocaleUpperCase()}
      />
    </Tooltip>
  );
};

const labNon = (clck: () => void) => {
  return (
    <Tooltip
      desc={
        <div>
          <div>click to assign a</div>
          <div>designated purpose</div>
        </div>
      }
      side="right"
    >
      <LabelButton
        clck={clck}
        gray={true}
        text={WalletLabelUnassigned.toLocaleUpperCase()}
      />
    </Tooltip>
  );
};
