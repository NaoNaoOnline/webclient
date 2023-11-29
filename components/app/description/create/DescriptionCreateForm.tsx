import { useEffect, useRef, FormEvent, KeyboardEvent } from "react";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { DescriptionCreate } from "@/modules/api/description/create/Create";
import { NewDescriptionCreateRequestFromFormData } from "@/modules/api/description/create/Request";
import DescriptionSearchObject from "@/modules/api/description/search/Object";

interface Props {
  cncl: () => void;
  done: (des: DescriptionSearchObject) => void;
  evnt: string;
}

export function DescriptionCreateForm(props: Props) {
  const { addErro, addPgrs, addScss } = useToast();
  const { atkn, uuid } = useAuth();

  const inpt = useRef<HTMLInputElement | null>(null);

  const pgrs: ProgressPropsObject = new ProgressPropsObject("Adding New Description");
  const scss: SuccessPropsObject = new SuccessPropsObject("Huzzah, description addedd my lord!");

  const handleSubmit = async (evn: FormEvent) => {
    evn.preventDefault();

    addPgrs(pgrs);

    const frm = new FormData(evn.target as HTMLFormElement);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [des] = await DescriptionCreate(NewDescriptionCreateRequestFromFormData(frm, atkn, props.evnt));

      const newDesc = new DescriptionSearchObject({
        // local
        imag: "",
        name: "",
        // extern
        extern: [],
        // intern
        crtd: des.crtd,
        desc: des.desc,
        user: uuid,
        // public
        evnt: props.evnt,
        text: frm.get("description-input")?.toString() || "",
      });

      pgrs.setDone(() => {
        props.cncl();
        props.done(newDesc);
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      addErro(new ErrorPropsObject("Ay papi, the beavers don't want you to say that just yet!", err as Error));
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
      <form onSubmit={handleSubmit} className="px-2 pb-2 bg-gray-200 dark:bg-gray-800">
        <input
          type="text"
          id="description-input"
          name="description-input"
          minLength={20}
          maxLength={120}
          pattern={`^([A-Za-z0-9\\s,.\\:\\-'"!$%&#]+(?:\s*,\s*[A-Za-z0-9\\s,.\\:\\-'"!$%&#]+)*)$`}
          title={`allowed are words, numbers and: , . : - ' " ! $ % & #`}
          className="flex px-0 pt-0 w-full text-sm align-middle text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder="dicussing how EIP-4844 will change L2 economics forever"
          ref={inpt}
          required
          onKeyDown={(eve: KeyboardEvent<HTMLInputElement>) => { if (eve.key === "Escape") props.cncl() }}
        />

        <div className="flex gap-x-3 pt-2">
          <button
            type="submit"
            disabled={pgrs.getCmpl() !== 0}
            className="flex-1 w-full md:w-auto px-5 py-2.5 text-gray-50 bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center"
            onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
          >
            Submit
          </button>

          <button
            onClick={props.cncl}
            type="button"
            className="flex-1 w-full md:w-auto px-5 py-2.5 text-gray-50 bg-gray-200 dark:bg-gray-800 enabled:bg-red-700 enabled:dark:bg-red-700 enabled:hover:bg-red-800 enabled:dark:hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center"
            onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
