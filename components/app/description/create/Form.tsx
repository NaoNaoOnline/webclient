import { useEffect, useRef, useState, FormEvent, KeyboardEvent } from 'react';

import { DescriptionCreate } from '@/modules/api/description/create/Create'
import { NewDescriptionCreateRequestFromFormData } from '@/modules/api/description/create/Request'

import ErrorToast from '@/components/app/toast/ErrorToast'
import ProgressToast from '@/components/app/toast/ProgressToast'
import SuccessToast from '@/components/app/toast/SuccessToast'
import { DescriptionSearchResponse } from '@/modules/api/description/search/Response';

import Errors from '@/modules/errors/Errors';

interface Props {
  atkn: string;
  cncl: () => void;
  done: (des: DescriptionSearchResponse) => void;
  evnt: string;
}

export default function Form(props: Props) {
  const inpt = useRef<HTMLInputElement | null>(null);

  const [cmpl, setCmpl] = useState<number>(0);
  const [cncl, setCncl] = useState<boolean>(false);
  const [desc, setDesc] = useState<DescriptionSearchResponse | null>(null);
  const [erro, setErro] = useState<Errors[]>([]);
  const [sbmt, setSbmt] = useState<boolean[]>([]);

  const handleSubmit = async (evn: FormEvent) => {
    evn.preventDefault();
    setCncl(false);
    setSbmt((old: boolean[]) => [...old, true]);

    const frm = new FormData(evn.target as HTMLFormElement);

    try {
      setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [des] = await DescriptionCreate(NewDescriptionCreateRequestFromFormData(frm, props.atkn, props.evnt));

      setDesc({
        // local
        imag: "",
        name: "",
        // intern
        crtd: des.crtd,
        desc: des.desc,
        user: "",
        // public
        evnt: props.evnt,
        text: frm.get("description-input")?.toString() || "",
      });

      setCmpl(100);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      setCmpl(0);
      setCncl(true);
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
          className="flex-1 px-0 pt-0 w-full text-sm align-middle text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder="dicussing how EIP-4844 will change L2 economics forever"
          ref={inpt}
          required
        />

        <div className="flex flex-row pt-2">
          <button
            type="submit"
            disabled={sbmt && !erro}
            className="flex-1 w-full md:w-auto mr-1 px-5 py-2.5 text-white bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center"
            onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
          >
            Submit
          </button>

          <button
            onClick={props.cncl}
            type="button"
            className="flex-1 w-full md:w-auto ml-1 px-5 py-2.5 text-white bg-gray-200 dark:bg-gray-800 enabled:bg-red-700 enabled:dark:bg-red-700 enabled:hover:bg-red-800 enabled:dark:hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center"
            onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
          >
            Cancel
          </button>
        </div>

        {sbmt.map((x, i) => (
          <ProgressToast
            key={i}
            cmpl={cmpl}
            cncl={cncl}
            desc="Adding New Description"
            done={() => {
              props.cncl();
              if (desc) props.done(desc);
            }}
          />
        ))}

        {erro.map((x, i) => (
          <ErrorToast
            key={i}
            erro={x}
          />
        ))}

        {cmpl >= 100 && (
          <SuccessToast
            desc="Huzzah, description addedd my lord!"
          />
        )}
      </form>
    </>
  );
}
