import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

import { ListUpdate } from "@/modules/api/list/update/Update";
import { ListSearchResponse } from "@/modules/api/list/search/Response";

import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { useAuth } from "@/components/app/auth/AuthProvider";

interface Props {
  cncl: () => void;
  done: (des: string) => void;
  list: ListSearchResponse;
}

export function ListUpdateForm(props: Props) {
  const { addErro, addPgrs, addScss } = useToast();
  const { atkn } = useAuth();

  const [desc, setDesc] = useState<string>(props.list.desc);

  const inpt = useRef<HTMLInputElement | null>(null);

  const pgrs: ProgressPropsObject = new ProgressPropsObject("Updating List");
  const scss: SuccessPropsObject = new SuccessPropsObject("Happy Hanukkah bb, best list ever!");

  const handleSubmit = async (evn: FormEvent) => {
    evn.preventDefault();

    const frm: FormData = new FormData(evn.target as HTMLFormElement);
    const des: string = frm.get("description-input")?.toString() || "";

    if (des === props.list.desc) {
      props.done(desc);
      return;
    }

    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [upd] = await ListUpdate([{ atkn: atkn, desc: des, list: props.list.list }]);

      setDesc(des);

      pgrs.setDone(() => {
        props.done(des);
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      addErro(new ErrorPropsObject("Oh no señor, esta liste no bueno mhh mhmhh!", err as Error));
    }
  };

  useEffect(() => {
    // The goal here is to auto-focus on the input text field, which we
    // conditionally render below. The user clicks a button to update a list
    // description and should then be able to write right away as soon as the
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
    <>
      <form onSubmit={handleSubmit} className="flex flex-row p-1 w-full">
        <input
          type="text"
          id="description-input"
          name="description-input"
          minLength={2}
          maxLength={40}
          pattern={`^([A-Za-z0-9\\s,.\\:\\-'"!$%&#]+(?:\s*,\s*[A-Za-z0-9\\s,.\\:\\-'"!$%&#]+)*)$`}
          title={`allowed are words, numbers and: , . : - ' " ! $ % & #`}
          className="flex p-2 pb-[6px] w-full align-middle text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          defaultValue={desc}
          ref={inpt}
          required
          onKeyDown={(eve: KeyboardEvent<HTMLInputElement>) => { if (eve.key === "Escape") props.cncl() }}
        />

        <button
          type="submit"
          disabled={pgrs.getCmpl() !== 0}
          className="flex w-auto ml-2 px-5 py-2.5 text-gray-50 bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center"
          onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
        >
          Submit
        </button>

        <button
          onClick={props.cncl}
          type="button"
          className="flex w-auto ml-2 px-5 py-2.5 text-gray-50 bg-gray-200 dark:bg-gray-800 enabled:bg-red-700 enabled:dark:bg-red-700 enabled:hover:bg-red-800 enabled:dark:hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center"
          onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
        >
          Cancel
        </button>
      </form>
    </>
  );
}
