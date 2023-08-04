import "flowbite";
import { FormEvent } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client';

import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

import DatePicker from '@/components/app/add-event/DatePicker'
import TextInput from '@/components/app/add-event/TextInput'
import TimePicker from '@/components/app/add-event/TimePicker'

import { EventCreate } from '@/modules/api/event/create/Create'
import { NewEventCreateRequestFromFormData } from '@/modules/api/event/create/Request'

const handleSubmit = async (event: FormEvent) => {
  event.preventDefault();

  const formData = new FormData(event.target as HTMLFormElement);

  EventCreate(await NewEventCreateRequestFromFormData(formData));
}

export default function Page() {
  const { user, isLoading } = useUser();

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
                  />
                  <TextInput
                    name="category"
                    text="Category"
                    type="text"
                    description="the category labels for topics this event is about"
                    placeholder="Crypto, DeFi, MEV"
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
                <button type="submit" className="text-white bg-blue-700 mb-6 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full md:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
              </form>
            )}
            {!isLoading && !user && (
              <div id="toast-top-left" className="flex items-center w-full max-w-xs p-4 space-x-4 bg-gray-200 dark:text-white dark:bg-gray-800 rounded-lg space-x" role="alert">
                <ExclamationCircleIcon className="w-10 h-10 dark:text-white" />
                <div className="pl-4 text-sm font-normal">You need to be logged in if you want to add a new event.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
