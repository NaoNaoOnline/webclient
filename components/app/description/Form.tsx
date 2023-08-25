import React, { useState, MouseEvent, FormEvent } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import { DescriptionCreate } from '@/modules/api/description/create/Create'
import { NewDescriptionCreateRequestFromFormData } from '@/modules/api/description/create/Request'

import ErrorToast from '@/components/app/event/add/ErrorToast'
import LoginToast from '@/components/app/event/add/LoginToast'
import ProgressToast from '@/components/app/event/add/ProgressToast'
import SuccessToast from '@/components/app/event/add/SuccessToast'

interface Props {
  atkn: string;
  cncl: () => void;
  done: (des: string) => void;
  evnt: string;
}

export default function Form(props: Props) {
  const { user, isLoading } = useUser();

  const [completed, setCompleted] = useState<number>(0);
  const [desc, setDesc] = useState<string>("");
  const [failed, setFailed] = useState<Error | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (evn: FormEvent) => {
    evn.preventDefault();
    setSubmitted(true);

    const frm = new FormData(evn.target as HTMLFormElement);

    try {
      setCompleted(25);
      await new Promise(r => setTimeout(r, 200));
      setCompleted(50);
      await new Promise(r => setTimeout(r, 200));
      setCompleted(75);
      await new Promise(r => setTimeout(r, 400));

      const des = await DescriptionCreate(NewDescriptionCreateRequestFromFormData(frm, props.atkn, props.evnt));

      setDesc(frm.get("description-input")?.toString() || "");

      setCompleted(100);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      if (err instanceof Error) {
        setFailed(err);
      } else {
        setFailed(new Error("Oh snap, the beavers were at it again! An unknown error occurred."));
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
            pattern={`^([A-Za-z0-9\\s,.\\-'"!$%&#]+(?:\s*,\s*[A-Za-z0-9\\s,.\\-'"!$%&#]+)*)$`}
            className="flex-1 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="dicussing how EIP-4844 will change L2 economics forever"
            required
          />

          <div className="flex flex-row pt-2">
            <button
              type="submit"
              disabled={submitted && !failed}
              className="flex-1 w-full md:w-auto mr-1 px-5 py-2.5 text-white bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center">
              Submit
            </button>

            <button
              onClick={props.cncl}
              type="button"
              disabled={submitted && !failed}
              className="flex-1 w-full md:w-auto ml-1 px-5 py-2.5 text-white bg-gray-200 dark:bg-gray-800 enabled:bg-red-700 enabled:dark:bg-red-700 enabled:hover:bg-red-800 enabled:dark:hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm text-center">
              Cancel
            </button>
          </div>

          {submitted && (
            <ProgressToast callback={submitToastCallback} completed={completed} failed={failed} />
          )}

          {failed && (
            <ErrorToast error={failed} />
          )}

          {completed >= 100 && (
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
