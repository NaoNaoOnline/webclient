import { FormEvent, KeyboardEvent, memo, useEffect, useRef, useState } from "react";

import { CheckLineIcon } from "@/components/app/icon/base/CheckLineIcon";
import { XMarkIcon } from "@/components/app/icon/base/XMarkIcon";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { RowGrid } from "@/components/app/layout/RowGrid";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { LabelUpdate } from "@/modules/api/label/update/Update";
import { LabelUpdateRequest } from "@/modules/api/label/update/Request";

interface Props {
  cncl: () => void;
  done: (key: string, val: string) => void;
  labl: string;
}

const LabelProfileCreateForm = memo((props: Props) => {
  const { addErro, addPgrs, addScss } = useToast();
  const { atkn } = useAuth();

  const [pkey, setPkey] = useState<string>("");
  const [pval, setPval] = useState<string>("");

  const inpt = useRef<HTMLInputElement | null>(null);

  const pgrs: ProgressPropsObject = new ProgressPropsObject("Updating Profile");
  const scss: SuccessPropsObject = new SuccessPropsObject("Getting better every day, you rock!");

  const handleSubmit = async (evn: FormEvent) => {
    evn.preventDefault();

    const frm: FormData = new FormData(evn.target as HTMLFormElement);
    const key: string = frm.get("create-profile-key-input")?.toString() || "";
    const val: string = frm.get("create-profile-value-input")?.toString() || "";

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
        oper: ["add"],
        path: ["/prfl/data/" + key],
        valu: [val],
      };

      const [upd] = await LabelUpdate([req]);

      setPkey(key);
      setPval(val);

      addScss(scss);
      pgrs.setDone(() => {
        props.done(key, val);
      });
    } catch (err) {
      addErro(new ErrorPropsObject("Ser pls, ma familia!", err as Error));
    }
  };

  useEffect(() => {
    // The goal here is to auto-focus on the input text field, which we
    // conditionally render below. The user clicks a button to add a new profile
    // to an event and should then be able to write right away as soon as the
    // input text field is rendered. Using the timeout of some milliseconds was
    // the only way this behaviour could be achieved reliably for the user. If
    // somebody knows a better way of doing this, please create a pull request.
    setTimeout(() => {
      if (inpt.current) {
        inpt.current.focus();
      }
    }, 100);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="">
      <RowGrid
        subj={
          <input
            type="text"
            id="create-profile-key-input"
            name="create-profile-key-input"
            minLength={2}
            maxLength={40}
            pattern={`^([A-Za-z]+)$`}
            title={`allowed are words`}
            className={`
                  flex w-full mr-3
                  bg-transparent
                  text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500
                  border-0 border-r-2 border-gray-300 dark:border-gray-600
                  focus:border-blue-600 dark:focus:border-blue-500
                  focus:outline-none focus:ring-0
                  align-middle appearance-none peer
                `}
            defaultValue={pkey}
            ref={inpt}
            required
            onKeyDown={(eve: KeyboardEvent<HTMLInputElement>) => {
              if (eve.key === "Escape") {
                props.cncl();
              }
            }}
          />
        }
        midl={
          <div className="flex flex-row w-full">
            <input
              type="text"
              id="create-profile-value-input"
              name="create-profile-value-input"
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
              required
              onKeyDown={(eve: KeyboardEvent<HTMLInputElement>) => {
                if (eve.key === "Escape") {
                  props.cncl();
                }
              }}
            />
          </div>
        }
        rigt={
          <div className="flex">
            <button
              className="ml-3 outline-none"
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
              onClick={() => {
                props.cncl();
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
        }
      />
    </form>
  );
});

LabelProfileCreateForm.displayName = "LabelProfileCreateForm";

export { LabelProfileCreateForm };
