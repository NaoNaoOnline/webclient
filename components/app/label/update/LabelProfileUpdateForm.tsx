import { FormEvent, KeyboardEvent, memo, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { RowGrid } from "@/components/app/layout/RowGrid";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { LabelUpdate } from "@/modules/api/label/update/Update";
import { LabelUpdateRequest } from "@/modules/api/label/update/Request";
import { ProfileURL } from "@/modules/profile/ProfileURL";

interface Props {
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
        path: [props.pkey, props.pkey],
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
    <RowGrid
      key={props.pkey}
      list={true}
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
          <form onSubmit={handleSubmit} className="flex flex-row w-full">
            <input
              type="text"
              id="profile-value-input"
              name="profile-value-input"
              minLength={2}
              maxLength={40}
              pattern={`^([A-Za-z0-9\\s,.\\:\\-'"!$%&#]+(?:\s*,\s*[A-Za-z0-9\\s,.\\:\\-'"!$%&#]+)*)$`}
              title={`allowed are words, numbers and: , . : - ' " ! $ % & #`}
              className={`
                  flex w-full
                  bg-transparent
                  text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500
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

            <button
              className="ml-3 outline-none"
              type="submit"
              disabled={pgrs.getCmpl() !== 0}
              onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
            >
              <CheckIcon
                className={`
                   w-5 h-5 text-gray-500 dark:text-gray-500
                   hover:text-gray-900 dark:hover:text-gray-50
                `}
              />
            </button>

            <button
              className="ml-3 outline-none"
              onClick={() => {
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
          </form>
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
              onClick={() => {
                setForm(true);
              }}
            >
              <PencilSquareIcon
                className={`
                   w-5 h-5 text-gray-500 dark:text-gray-500
                   hover:text-gray-900 dark:hover:text-gray-50
                `}
              />
            </button>
          </div>
        ) : (
          undefined
        )
      }
    />
  );
});

LabelProfileUpdateForm.displayName = "LabelProfileUpdateForm";

export { LabelProfileUpdateForm };
