import "flowbite";
import React, { useState, FormEvent, KeyboardEvent } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';

import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'

import DatePicker from '@/components/app/event/add/DatePicker'
import TextInput from '@/components/app/event/add/TextInput'
import TimePicker from '@/components/app/event/add/TimePicker'

import ErrorToast from '@/components/app/toast/ErrorToast'
import LoginToast from '@/components/app/toast/LoginToast'
import ProgressToast from '@/components/app/toast/ProgressToast'
import SuccessToast from '@/components/app/toast/SuccessToast'

import { EventCreate } from '@/modules/api/event/create/Create'
import { NewEventCreateRequest } from '@/modules/api/event/create/Request'
import { DescriptionCreate } from '@/modules/api/description/create/Create'
import { NewDescriptionCreateRequestFromFormData } from '@/modules/api/description/create/Request'
import { LabelCreate } from '@/modules/api/label/create/Create'
import { LabelCreateRequest } from '@/modules/api/label/create/Request'
import { LabelCreateResponse } from "@/modules/api/label/create/Response";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

import CacheApiLabel from '@/modules/cache/api/Label';
import CacheAuthToken from '@/modules/cache/auth/Token';

import Errors from '@/modules/errors/Errors';

export default function Page() {
  const { user, isLoading } = useUser();

  const [cmpl, setCmpl] = useState<number>(0);
  const [cncl, setCncl] = useState<boolean>(false);
  const [evnt, setEvnt] = useState<string>("");
  const [erro, setErro] = useState<Errors[]>([]);
  const [sbmt, setSbmt] = useState<boolean[]>([]);

  const cat: string = CacheAuthToken(user ? true : false);
  const cal: LabelSearchResponse[] = CacheApiLabel(user ? true : false, cat);

  const handleSubmit = async (evn: FormEvent) => {
    evn.preventDefault();
    setCncl(false);
    setSbmt((old: boolean[]) => [...old, true]);

    const frm = new FormData(evn.target as HTMLFormElement);

    try {
      // Get clean string lists for the user category input and user host input.
      const uci = (frm.get("category-input")?.toString() || "").split(",").map(x => x.trim());
      const uhi = (frm.get("host-input")?.toString() || "").split(",").map(x => x.trim());

      // Get the list of desired category names and desired host names that
      // still have to be created.
      const dcn = unqLab(uci, cal);
      const dhn = unqLab(uhi, cal);

      // Create the category labels in the backend, if any.
      let nci: string[] = [];
      if (dcn.length > 0) {
        const res = await LabelCreate(LabelCreateRequest(cat, "cate", dcn));
        nci = res.map((x: LabelCreateResponse) => x.labl);

        // Add the created category labels to the local copy of cashed API
        // labels, so in case of an error during event creation, any label that
        // got created before the event creation failed is not causing problems
        // if the user submits the form again.
        for (let i = 0; i < res.length; i++) {
          cal.push({ labl: nci[i], name: dcn[i] });
        }

        setCmpl(25);
        await new Promise(r => setTimeout(r, 200));
      }

      // Create the host labels in the backend, if any.
      let nhi: string[] = [];
      if (dhn.length > 0) {
        const res = await LabelCreate(LabelCreateRequest(cat, "host", dhn));
        nhi = res.map((x: LabelCreateResponse) => x.labl);

        // Add the created host labels to the local copy of cashed API
        // labels, so in case of an error during event creation, any label that
        // got created before the event creation failed is not causing problems
        // if the user submits the form again.
        for (let i = 0; i < res.length; i++) {
          cal.push({ labl: nhi[i], name: dhn[i] });
        }

        setCmpl(50);
        await new Promise(r => setTimeout(r, 200));
      }

      // Get the cached category ids and cached host ids for the user input that
      // did already exist in the backend. 
      const cci = cal.filter(x => uci.includes(x.name)).map(x => x.labl);
      const chi = cal.filter(x => uhi.includes(x.name)).map(x => x.labl);

      // Create the event resource in the backend, now that we ensured our label
      // ids.
      const [evn] = await EventCreate([NewEventCreateRequest(frm, cat, [...nci, ...cci], [...nhi, ...chi])]);
      setEvnt(evn.evnt);
      setCmpl(75);

      await new Promise(r => setTimeout(r, 400));

      const des = await DescriptionCreate(NewDescriptionCreateRequestFromFormData(frm, cat, evn.evnt));
      setCmpl(100);

      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      setCmpl(0);
      setCncl(true);
      setErro((old: Errors[]) => [...old, new Errors("Oh snap, the beavers don't want you to tell the world right now!", err as Error)]);
    }
  };

  return (
    <>
      <div className="pl-4 pr-4 mt-4 md:ml-64">
        <div className="pl-4 pr-4 flex grid justify-items-center">
          <div className="rounded-lg w-full max-w-xl">

            <ul className="flex flex-row w-full">
              <li className="flex items-center md:hidden mr-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 group">
                <button className="p-2" data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button">
                  <Bars3BottomLeftIcon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                </button>
              </li>
              <li className="w-full">
                <h3 className="text-3xl text-gray-900 dark:text-white">Add Event</h3>
              </li>
            </ul>

          </div>
        </div>
      </div>

      <div className="pl-4 pr-4 mt-4 md:ml-64">
        <div className="pl-4 pr-4 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-white">
            {isLoading && (
              <></>
            )}
            {!isLoading && user && (
              <form onSubmit={handleSubmit}>
                <div className="grid">
                  <TextInput
                    name="host"
                    text="Host"
                    type="text"
                    description="the host labels for who is organizing this event"
                    placeholder="Flashbots"
                    pattern="^(?:[A-Za-z0-9\s]{3,18}(?:\s*,\s*[A-Za-z0-9\s]{3,18}){0,4})?$"
                    title="allowed are up to 5 comma separated host labels, each 3-18 characters long, without special characters"
                  />
                  <TextInput
                    name="category"
                    text="Category"
                    type="text"
                    description="the category labels for topics this event is about"
                    placeholder="Crypto, DeFi, MEV"
                    pattern="^(?:[A-Za-z0-9\s]{3,18}(?:\s*,\s*[A-Za-z0-9\s]{3,18}){0,4})?$"
                    title="allowed are up to 5 comma separated category labels, each 3-18 characters long, without special characters"
                  />
                  <TextInput
                    name="link"
                    text="Link"
                    type="url"
                    description="the online location at which this event takes place"
                    placeholder="https://discord.gg/Flashbots"
                    pattern="https:\/\/(www\.)?.*"
                  />
                  <TextInput
                    name="description"
                    text="Description"
                    type="text"
                    description="the short one-liner for what this event is about"
                    placeholder="dicussing how EIP-4844 will change L2 economics forever"
                    minLength={20}
                    maxLength={120}
                    pattern={`^([A-Za-z0-9\\s,.\\:\\-'"!$%&#]+(?:\s*,\s*[A-Za-z0-9\\s,.\\:\\-'"!$%&#]+)*)$`}
                    title={`allowed are words, numbers and: , . : - ' " ! $ % & #`}
                  />
                </div>
                <div className="grid gap-6 grid-cols-3">
                  <DatePicker
                    name="date"
                    text="Date"
                    description="the day at which this event is expected to happen"
                  />
                  <TimePicker
                    name="start"
                    text="Start"
                    offset={0}
                    description="the time at which this event is expected to start"
                    position="right"
                  />
                  <TimePicker
                    name="end"
                    text="End"
                    offset={1 * 60 * 60 * 1000}
                    description="the time at which this event is expected to end"
                    position="left"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sbmt && !erro}
                  className="text-white bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 mb-6 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full md:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
                >
                  Submit
                </button>

                {sbmt.map((x, i) => (
                  <ProgressToast
                    key={i}
                    cmpl={cmpl}
                    cncl={cncl}
                    done={() => {
                      window.location.href = "/event/" + evnt;
                    }}
                    titl="Adding New Event"
                  />
                ))}

                {erro.map((x, i) => (
                  <ErrorToast key={i} erro={x} />
                ))}

                {cmpl >= 100 && (
                  <SuccessToast
                    titl="Hooray, event addedd milady!"
                  />
                )}
              </form>
            )}
            {!isLoading && !user && (
              <LoginToast
                titl="You need to be logged in if you want to add a new event."
              />
            )}
          </div>
        </div>
      </div >
    </>
  )
}

// unqLab returns the list of label names that do not already exist according to
// the given LabelSearchResponse.
function unqLab(des: string[], lis: LabelSearchResponse[]): string[] {
  // Extract the current labels from the lis array.
  const cur = lis.map(x => x.name);

  // Filter out labels that already exist.
  const unq = des.filter(x => !cur.includes(x));

  return unq;
}
