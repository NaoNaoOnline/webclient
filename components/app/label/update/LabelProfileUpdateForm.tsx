import { FormEvent, KeyboardEvent, MouseEvent, memo, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { CheckLineIcon } from "@/components/app/icon/base/CheckLineIcon";
import { PencilLineIcon } from "@/components/app/icon/base/PencilLineIcon";
import { XMarkIcon } from "@/components/app/icon/base/XMarkIcon";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { LabelProfileDeleteForm } from "@/components/app/label/delete/LabelProfileDeleteForm";
import { RowGrid } from "@/components/app/layout/RowGrid";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { LabelUpdate } from "@/modules/api/label/update/Update";
import { LabelUpdateRequest } from "@/modules/api/label/update/Request";
import { ProfileURL } from "@/modules/profile/ProfileURL";

interface Props {
  dltd: (key: string) => void;
  done: (val: string) => void;
  labl: string;
  ownr: boolean;
  pkey: string;
  pval: string;
}

const LabelProfileUpdateForm = memo((props: Props) => {
  const { addErro, addPgrs, addScss } = useToast();
  const { atkn } = useAuth();

  const [form, setForm] = useState<boolean>(false);
  const [pval, setPval] = useState<string>(props.pval);

  const inpt = useRef<HTMLInputElement | null>(null);

  const pgrs: ProgressPropsObject = new ProgressPropsObject("Updating Profile");
  const scss: SuccessPropsObject = new SuccessPropsObject("Getting better every day, you rock!");

  const handleSubmit = async (evn: FormEvent) => {
    evn.preventDefault();

    const frm: FormData = new FormData(evn.target as HTMLFormElement);
    const val: string = frm.get("profile-value-input")?.toString() || "";

    if (val === pval) {
      props.done(pval);
      setForm(false);
      return;
    }

    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const req: LabelUpdateRequest = {
        // local
        atkn: atkn,
        // intern
        labl: props.labl,
        // update
        oper: ["remove", "add"],
        path: ["/prfl/data/" + props.pkey, "/prfl/data/" + props.pkey],
        valu: [pval, val],
      };

      const [upd] = await LabelUpdate([req]);

      setPval(val);

      addScss(scss);
      pgrs.setDone(() => {
        props.done(val);
        setForm(false);
      });
    } catch (err) {
      addErro(new ErrorPropsObject("Ser pls, ma familia!", err as Error));
    }
  };

  useEffect(() => {
    if (form && inpt.current) {
      inpt.current.focus();
    }
  }, [form]);

  return (
    <form onSubmit={handleSubmit} className="">
      <RowGrid
        key={props.pkey}
        subj={
          <div>
            {props.pkey}
          </div>
        }
        midl={!form ? (
          <Link
            href={ProfileURL(props.pkey) + "/" + pval}
            target="_blank"
            className={`
              truncate max-w-[150px]
              hover:underline hover:underline-offset-2
            `}
          >
            {pval}
          </Link>
        ) : (
          <div>
            <input
              type="text"
              id="profile-value-input"
              name="profile-value-input"
              minLength={2}
              maxLength={40}
              pattern={`^([A-Za-z0-9._\\-]+)$`}
              title={`allowed are words, numbers and: . _ -`}
              className={`
                flex w-full
                bg-transparent
                text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500
                border-0 border-r-2 border-gray-300 dark:border-gray-600
                focus:border-blue-600 dark:focus:border-blue-500
                focus:outline-none focus:ring-0
                align-middle appearance-none peer
              `}
              defaultValue={pval}
              ref={inpt}
              required
              onKeyDown={(eve: KeyboardEvent<HTMLInputElement>) => {
                if (eve.key === "Escape") {
                  setForm(false);
                }
              }}
            />
          </div>
        )}
        rigt={
          !form && props.ownr ? (
            <div
              className="flex invisible group-hover/RowGrid:visible"
            >
              <button
                className="ml-3 outline-none invisible group-hover/RowGrid:visible"
                type="button"
                onClick={(eve: MouseEvent<HTMLButtonElement>) => {
                  eve.preventDefault();
                  eve.stopPropagation();
                  setForm(true);
                }}
              >
                <PencilLineIcon
                  className={`
                   w-5 h-5 text-gray-500 dark:text-gray-500
                   hover:text-gray-900 dark:hover:text-gray-50
                `}
                />
              </button>

              <LabelProfileDeleteForm
                done={props.dltd}
                labl={props.labl}
                pkey={props.pkey}
                pval={props.pval}
              />
            </div>
          ) : (
            <div className="flex">
              <button
                className="ml-3 outline-none"
                onClick={(eve: MouseEvent<HTMLButtonElement>) => {
                  eve.preventDefault();
                  eve.stopPropagation();
                }}
                type="submit"
                disabled={pgrs.getCmpl() !== 0}
                onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
              >
                <CheckLineIcon
                  className={`
                     w-5 h-5 text-gray-500 dark:text-gray-500
                     hover:text-gray-900 dark:hover:text-gray-50
                  `}
                />
              </button>

              <button
                className="ml-3 outline-none"
                onClick={(eve: MouseEvent<HTMLButtonElement>) => {
                  eve.preventDefault();
                  eve.stopPropagation();
                  setForm(false);
                }}
                type="button"
                onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
              >
                <XMarkIcon
                  className={`
                     w-5 h-5 text-gray-500 dark:text-gray-500
                     hover:text-gray-900 dark:hover:text-gray-50
                  `}
                />
              </button>
            </div>
          )
        }
      />
    </form>
  );
});

LabelProfileUpdateForm.displayName = "LabelProfileUpdateForm";

export { LabelProfileUpdateForm };
