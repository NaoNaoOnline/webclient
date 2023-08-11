import "flowbite";
import React, { useState, useEffect, FormEvent } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';

import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'

import LoginToast from '@/components/app/LoginToast'
import DatePicker from '@/components/app/add-event/DatePicker'
import TextInput from '@/components/app/add-event/TextInput'
import TimePicker from '@/components/app/add-event/TimePicker'

import { EventCreate } from '@/modules/api/event/create/Create'
import { NewEventCreateRequestFromFormData } from '@/modules/api/event/create/Request'
import { DescriptionCreate } from '@/modules/api/description/create/Create'
import { NewDescriptionCreateRequestFromFormData } from '@/modules/api/description/create/Request'
import { LabelCreate } from '@/modules/api/label/create/Create'
import { CateLabelCreateRequest, HostLabelCreateRequest } from '@/modules/api/label/create/Request'
import { LabelCreateResponse } from "@/modules/api/label/create/Response";

import Token from '@/modules/auth/Token';

export default function Page() {
  const [completed, setCompleted] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const { user, isLoading } = useUser();
  const atk = Token();

  const handleSubmit = async (evn: FormEvent) => {
    evn.preventDefault();
    setSubmitted(true);

    const frm = new FormData(evn.target as HTMLFormElement);

    try {
      const cat = await LabelCreate(CateLabelCreateRequest(atk, frm.get("category-input")?.toString() || ""));
      setCompleted(25);
      await new Promise(r => setTimeout(r, 600));
      const hos = await LabelCreate(HostLabelCreateRequest(atk, frm.get("host-input")?.toString() || ""));
      setCompleted(50);
      await new Promise(r => setTimeout(r, 200));
      const res = await EventCreate(NewEventCreateRequestFromFormData(frm, atk, cat.map((x: LabelCreateResponse) => x.labl).join(','), hos[0].labl));
      setCompleted(75);
      await new Promise(r => setTimeout(r, 400));
      const des = await DescriptionCreate(NewDescriptionCreateRequestFromFormData(frm, atk, res.evnt));
      setCompleted(100);
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
    }
  }

  useEffect(() => {
    if (completed >= 100) {
      setCompleted(0);
      setSubmitted(false);
    }
  }, [completed]);

  return (
    <>
      <div className="pl-4 pr-4 mt-4 md:ml-64">
        <div className="pl-4 pr-4 flex grid justify-items-center">
          <div className="rounded-lg w-full max-w-2xl">

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
          <div className="w-full max-w-2xl dark:text-white">
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
                    description="the host label for who is organizing this event"
                    placeholder="Flashbots"
                    pattern="^[A-Za-z0-9\s]+$"
                  />
                  <TextInput
                    name="category"
                    text="Category"
                    type="text"
                    description="the category labels for topics this event is about"
                    placeholder="Crypto, DeFi, MEV"
                    pattern="^([A-Za-z0-9\s]+(?:\s*,\s*[A-Za-z0-9\s]+)*)$"
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
                    maxLength={80}
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

                <button type="submit" disabled={submitted} className="text-white bg-blue-700 mb-6 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full md:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>

                {submitted && (
                  <div className="mb-6 w-full rounded-full h-2.5 bg-gray-200 dark:bg-gray-800">
                    <div className={`bg-blue-600 h-2.5 rounded-full w-[${completed}%] transition-width duration-1000 ease-in-out`}></div>
                  </div>
                )}
              </form>
            )}
            {!isLoading && !user && (
              <LoginToast />
            )}
          </div>
        </div>
      </div >
    </>
  )
}
