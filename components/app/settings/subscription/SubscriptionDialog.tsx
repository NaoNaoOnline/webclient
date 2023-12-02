import { KeyboardEvent, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import * as Separator from "@radix-ui/react-separator";

import { XMarkIcon } from "@heroicons/react/24/outline";

import { CreatorSelect } from "@/components/app/settings/subscription/CreatorSelect";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";

interface Props {
  clos: () => void;
  crtr: WalletSearchResponse[];
  mnth: string;
  open: boolean;
  sbmt: (wal: WalletSearchResponse[]) => void;
}

export const SubscriptionDialog = (props: Props) => {
  const [slct, setSlct] = useState<WalletSearchResponse[]>([]);

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
            onInteractOutside={(e) => e.preventDefault()}
            className={`
              relative w-full max-w-xl max-h-[400px] overflow-y-auto rounded-md justify-items-center
              bg-gray-50 dark:bg-gray-700
              mt-7 mx-auto p-4
              shadow-gray-400 dark:shadow-black shadow-[0_0_2px]
              focus:outline-none
            `}
          >

            <Dialog.Title className="flex flex-row mb-4 text-gray-900 dark:text-gray-50 text-md font-medium">
              Your NaoNao Premium Subscription
            </Dialog.Title>


            <div className="flex flex-row w-full h-[200px]">
              <div className="flex-1 w-full overflow-y-auto">

                {!props.crtr || props.crtr.length === 0 && (
                  <>
                    <div className="flex mb-2 text-xl justify-center">
                      <span>🤨</span>
                    </div>
                    <div className="flex text-sm justify-center">
                      <span className="text-gray-500 dark:text-gray-500">
                        There are no creators. Nobody created events on the
                        platform so far, or you have not been visiting any of
                        the events on the platform yet.
                      </span>
                    </div>
                  </>
                )}

                {props.crtr.map((x, i) => (
                  <CreatorSelect
                    key={i}
                    chck={(che: boolean | "indeterminate") => {
                      if (che === true) setSlct((old: WalletSearchResponse[]) => [...old, x]);
                      if (che === false) setSlct((old: WalletSearchResponse[]) => old.filter((y) => y.intern.wllt !== x.intern.wllt));
                    }}
                    dflt={slct.some((y: WalletSearchResponse) => y.intern.wllt === x.intern.wllt)}
                    user={x.intern.name}
                  />
                ))}

              </div>

              <Separator.Root
                className="bg-gray-300 dark:bg-gray-600 mx-3 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
                decorative
                orientation="vertical"
              />

              <div className="flex-1 w-full pr-2 text-gray-900 dark:text-gray-50 text-sm overflow-y-auto">
                <p className="mb-2">
                  Enjoy powerful premium features to make NaoNao your own.
                </p>

                <ul className="mb-2 pl-2 list-disc list-inside">
                  <li key={1}>
                    You get custom lists
                  </li>
                  <li key={2}>
                    You get your own home feed
                  </li>
                  {/* <li key={3}>
                    You get opt-in notifications
                  </li> */}
                  <li key={4}>
                    You get longer event retention
                  </li>
                </ul>

                <p className="mb-2">
                  Select up to 3 content creators that you want to support
                  directly. {/* Or, just make a&nbsp;
                  <span className="text-sky-500 cursor-pointer">
                    random selection.
                  </span> */}
                </p>

                <p>
                  This subscription is for 1 month and does <b>not </b>
                  auto-renew. You can renew your subscription, starting 7 days
                  before month end, and pick the event creators that brought the
                  best online events to you.
                </p>
              </div>

            </div>

            <button
              className="w-full mt-4 px-5 py-2.5 rounded-lg text-sm font-medium text-center text-gray-50 bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:outline-none"
              disabled={slct.length === 0 || slct.length > 3}
              onClick={() => props.sbmt(slct)}
              onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
            >
              Subscribe with $6 until the end of {props.mnth}
            </button>

            <Dialog.Close asChild>
              <button
                type="button"
                className="py-3 outline-none group"
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
};
