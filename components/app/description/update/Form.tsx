import { useEffect, useRef, useState, FormEvent, KeyboardEvent } from "react";

import { DescriptionUpdate } from "@/modules/api/description/update/Update";

import ErrorToast from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastContext";

import Errors from "@/modules/errors/Errors";

interface Props {
  atkn: string;
  cncl: () => void;
  desc: string;
  done: (txt: string) => void;
  text: string;
}

export default function Form(props: Props) {
  const { addPgrs, addScss } = useToast();

  const [text, setText] = useState<string>(props.text);
  const [erro, setErro] = useState<Errors[]>([]);

  const inpt = useRef<HTMLInputElement | null>(null);

  const pgrs: ProgressPropsObject = new ProgressPropsObject("Updating Description");
  const scss: SuccessPropsObject = new SuccessPropsObject("Bloody hell, that description got proper updated!");

  const handleSubmit = async (evn: FormEvent) => {
    evn.preventDefault();

    const frm: FormData = new FormData(evn.target as HTMLFormElement);
    const txt: string = frm.get("description-input")?.toString() || "";

    if (txt === props.text) {
      props.cncl();
      props.done(text);
      return;
    }


    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [upd] = await DescriptionUpdate([{ atkn: props.atkn, desc: props.desc, like: "", text: txt }]);

      setText(txt);

      pgrs.setDone(() => {
        props.cncl();
        props.done(txt);
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      setErro((old: Errors[]) => [...old, new Errors("Ay papi, the beavers don't want you to say that just yet!", err as Error)]);
    }
  };

  useEffect(() => {
    // The goal here is to auto-focus on the input text field, which we
    // conditionally render below. The user clicks a button to add a new
    // description to an event and should then be able to write right away as
    // soon as the input text field is rendered. Using the timeout of some
    // milliseconds was the only way this behaviour could be achieved reliably
    // for the user. If somebody knows a better way of doing this, please create
    // a pull request.
    setTimeout(() => {
      if (inpt.current) {
        inpt.current.focus();
      }
    }, 100);
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className="px-2 pb-2 bg-gray-50 dark:bg-gray-800">
        <input
          type="text"
          id="description-input"
          name="description-input"
          minLength={20}
          maxLength={120}
          pattern={`^([A-Za-z0-9\\s,.\\:\\-'"!$%&#]+(?:\s*,\s*[A-Za-z0-9\\s,.\\:\\-'"!$%&#]+)*)$`}
          title={`allowed are words, numbers and: , . : - ' " ! $ % & #`}
          className="flex-1 px-0 pt-0 w-full text-sm align-middle text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          defaultValue={text}
          ref={inpt}
          required
        />

        <div className="flex flex-row pt-2">
          <button
            type="submit"
            disabled={pgrs.getCmpl() !== 0}
            className="flex-1 w-full md:w-auto mr-1 px-5 py-2.5 text-gray-50 bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center"
            onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
          >
            Submit
          </button>

          <button
            onClick={props.cncl}
            type="button"
            className="flex-1 w-full md:w-auto ml-1 px-5 py-2.5 text-gray-50 bg-gray-200 dark:bg-gray-800 enabled:bg-red-700 enabled:dark:bg-red-700 enabled:hover:bg-red-800 enabled:dark:hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center"
            onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
          >
            Cancel
          </button>
        </div>

        {erro.map((x, i) => (
          <ErrorToast
            key={i}
            erro={x}
          />
        ))}
      </form>
    </>
  );
}
