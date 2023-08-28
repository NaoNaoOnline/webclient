import React, { useState, FormEvent } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { DescriptionCreate } from '@/modules/api/description/create/Create'
import { NewDescriptionCreateRequestFromFormData } from '@/modules/api/description/create/Request'

import ErrorToast from '@/components/app/event/add/ErrorToast'
import LoginToast from '@/components/app/event/add/LoginToast'
import ProgressToast from '@/components/app/event/add/ProgressToast'
import SuccessToast from '@/components/app/event/add/SuccessToast'
import { DescriptionSearchResponse } from '@/modules/api/description/search/Response';

interface Props {
  atkn: string;
  cncl: () => void;
  done: (des: DescriptionSearchResponse | null) => void;
  evnt: string;
}

export default function Form(props: Props) {
  const { user, isLoading } = useUser();

  const [cmpl, setCmpl] = useState<number>(0);
  const [desc, setDesc] = useState<DescriptionSearchResponse | null>(null);
  const [erro, setErro] = useState<Error | null>(null);
  const [sbmt, setSbmt] = useState<boolean>(false);

  const handleSubmit = async (evn: FormEvent) => {
    evn.preventDefault();
    setSbmt(true);

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
        evnt: "",
        text: frm.get("description-input")?.toString() || "",
      });

      setCmpl(100);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      if (err instanceof Error) {
        setErro(err);
      } else {
        setErro(new Error("Oh snap, the beavers were at it again! An unknown error occurred."));
      }
    }
  };

  const submitToastCallback = () => {
    props.cncl();
    props.done(desc);
  };

  return (
    <>
      {isLoading && (
        <></>
      )}
      {!isLoading && user && (
        <form onSubmit={handleSubmit} className="p-2 bg-gray-50 dark:bg-gray-800 first:border-none border-t-solid border-t border-gray-200 dark:border-gray-700">
          <input
            type="text"
            id="description-input"
            name="description-input"
            minLength={20}
            maxLength={120}
            pattern={`^([A-Za-z0-9\\s,.\\:\\-'"!$%&#]+(?:\s*,\s*[A-Za-z0-9\\s,.\\:\\-'"!$%&#]+)*)$`}
            title={`allowed are words, numbers and: , . : - ' " ! $ % & #`}
            className="flex-1 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="dicussing how EIP-4844 will change L2 economics forever"
            required
          />

          <div className="flex flex-row pt-2">
            <button
              type="submit"
              disabled={sbmt && !erro}
              className="flex-1 w-full md:w-auto mr-1 px-5 py-2.5 text-white bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center">
              Submit
            </button>

            <button
              onClick={props.cncl}
              type="button"
              disabled={sbmt && !erro}
              className="flex-1 w-full md:w-auto ml-1 px-5 py-2.5 text-white bg-gray-200 dark:bg-gray-800 enabled:bg-red-700 enabled:dark:bg-red-700 enabled:hover:bg-red-800 enabled:dark:hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center">
              Cancel
            </button>
          </div>

          {sbmt && (
            <ProgressToast callback={submitToastCallback} cmpl={cmpl} erro={erro} />
          )}

          {erro && (
            <ErrorToast error={erro} />
          )}

          {cmpl >= 100 && (
            <SuccessToast />
          )}
        </form>
      )}
      {!isLoading && !user && (
        <LoginToast />
      )}
    </>
  );
};
