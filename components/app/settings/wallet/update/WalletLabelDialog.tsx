import { KeyboardEvent, memo, useEffect, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";

import { RadioOffIcon } from "@/components/app/icon/base/RadioOffIcon";
import { RadioOnIcon } from "@/components/app/icon/base/RadioOnIcon";
import { XMarkIcon } from "@/components/app/icon/base/XMarkIcon";

import { CopyButton } from "@/components/app/button/CopyButton";
import { hasLabl } from "@/components/app/cache/CacheProvider";
import { LabelButton } from "@/components/app/button/LabelButton";
import { RowGrid } from "@/components/app/layout/RowGrid";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";
import { truncateEthAddress } from "@/modules/wallet/Address";
import { WalletLabelAccounting } from "@/modules/wallet/Label";
import { WalletLabelModeration } from "@/modules/wallet/Label";
import { WalletLabelUnassigned } from "@/modules/wallet/Label";

interface Props {
  clos: () => void;
  hacc: boolean; // user has accounting wallet
  open: boolean;
  sbmt: (lab: string) => void;
  wllt: WalletSearchResponse;
}

const WalletLabelDialog = memo((props: Props) => {
  const [curr, setCurr] = useState<string>("");
  const [slct, setSlct] = useState<string>("");

  const acc: boolean = hasLabl(props.wllt, WalletLabelAccounting);
  const mod: boolean = hasLabl(props.wllt, WalletLabelModeration);

  const icon = (lab: string) => {
    const cslo: boolean = lab === slct;                  // currently selected label option
    const loia: boolean = lab === WalletLabelAccounting; // label option is accounting

    if (cslo) return <RadioOnIcon />;
    if (!acc && loia && props.hacc) return <RadioOffIcon />;

    return (
      <RadioOffIcon
        className="cursor-pointer"
        onClick={() => {
          setSlct(lab);
        }}
      />
    );
  };

  const subj = (lab: string, col: "blue" | "gray" | "rose") => {
    const cslo: boolean = lab === slct;                  // currently selected label option
    const loia: boolean = lab === WalletLabelAccounting; // label option is accounting

    if (cslo || (!acc && loia && props.hacc)) {
      return (
        <Tooltip
          desc={
            <div>
              <div>you already have a designated</div>
              <div>accounting wallet configured</div>
            </div>
          }
          side="right"
        >
          <LabelButton
            blue={col === "blue"}
            gray={col === "gray"}
            rose={col === "rose"}
            text={lab.toLocaleUpperCase()}
          />
        </Tooltip>
      );
    }

    return (
      <LabelButton
        className={!cslo ? "cursor-pointer" : ""}
        clck={() => {
          if (!cslo) setSlct(lab);
        }}
        blue={col === "blue"}
        gray={col === "gray"}
        rose={col === "rose"}
        text={lab.toLocaleUpperCase()}
      />
    );
  };

  useEffect(() => {
    if (acc) {
      setCurr(WalletLabelAccounting);
    }
    if (mod) {
      setCurr(WalletLabelModeration);
    }
    if (!acc && !mod) {
      setCurr(WalletLabelUnassigned);
    }
  }, [acc, mod]);

  useEffect(() => {
    setSlct(curr);
  }, [curr]);

  return (
    <Dialog.Root
      open={props.open}
      onOpenChange={(ope: boolean) => {
        if (!ope) props.clos();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed bg-gray-900/50 pt-10 inset-0">
          <Dialog.Content
            className={`
                relative w-full max-w-xl max-h-[400px] overflow-y-auto rounded-md justify-items-center
                bg-gray-50 dark:bg-gray-700
                mt-7 mx-auto p-4
                shadow-gray-400 dark:shadow-black shadow-[0_0_2px]
                focus:outline-none
              `}
          >

            <Dialog.Title className="flex flex-row mb-4 text-gray-900 dark:text-gray-50 text-md font-medium">
              Assign a designated purpose to wallet&nbsp;

              <CopyButton
                className={`
                  text-gray-500 dark:text-gray-500
                  hover:underline hover:underline-offset-2 hover:decoration-dashed
                `}
                copy={props.wllt.public.addr}
                text={truncateEthAddress(props.wllt.public.addr)}
              />
            </Dialog.Title>

            <div
              className={`
                ${slct === WalletLabelUnassigned ? "bg-gray-200/30 dark:bg-gray-800/30" : ""}
              `}
            >
              <RowGrid
                icon={icon(WalletLabelUnassigned)}
                subj={subj(WalletLabelUnassigned, "gray")}
              />
              <RowGrid
                subj={
                  <div className="mr-5 text-sm">
                    This is the default state for new wallets added to your NaoNao
                    account. Wallets without designated purpose have no function.
                    Unassigned wallets cannot receive revenue share and cannot be
                    used for content moderation.
                  </div>
                }
              />
            </div>

            <div
              className={`
                ${slct === WalletLabelAccounting ? "bg-gray-200/30 dark:bg-gray-800/30" : ""}
              `}
            >
              <RowGrid
                icon={icon(WalletLabelAccounting)}
                subj={subj(WalletLabelAccounting, "blue")}
              />
              <RowGrid
                subj={
                  <div className="mr-5 text-sm">
                    Setting this label enables event creators to participate in
                    the free market revenue share mechanics, by allowing premium
                    subscribers to direct parts of their subscription fee to
                    your accounting wallet, if the individual premium subscriber
                    chooses to do so. Note that you may have only one accounting
                    wallet.
                  </div>
                }
              />
            </div>

            <div
              className={`
                ${slct === WalletLabelModeration ? "bg-gray-200/30 dark:bg-gray-800/30" : ""}
              `}
            >
              <RowGrid
                icon={icon(WalletLabelModeration)}
                subj={subj(WalletLabelModeration, "rose")}
              />
              <RowGrid
                subj={
                  <div className="mr-5 text-sm">
                    Setting this label enables policy members to participate in
                    content moderation on the NaoNao platform. Setting this
                    label without being a policy member does not have any
                    effect. To learn more about onchain permission management
                    have a look at our&nbsp;
                    <a
                      href="https://github.com/NaoNaoOnline/contracts"
                      target="_blank"
                      className="font-bold underline decoration-dashed"
                    >
                      contracts repository
                    </a>
                    .
                  </div>
                }
              />
            </div>

            <button
              className="w-full mt-4 px-5 py-2.5 rounded-lg text-sm font-medium text-center text-gray-50 bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:outline-none"
              disabled={curr === slct}
              onClick={() => props.sbmt(slct)}
              onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
            >
              Save {slct.toLocaleUpperCase()}
            </button>

            <Dialog.Close asChild>
              <button
                className="py-3 outline-none group"
                type="button"
                aria-label="Close"
              >
                <XMarkIcon className="absolute top-4 right-4 w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
              </button>
            </Dialog.Close>

          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root >
  );
});

WalletLabelDialog.displayName = "WalletLabelDialog";

export { WalletLabelDialog };
