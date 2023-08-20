import "flowbite";
import React, { MouseEvent } from 'react';
import { useRouter } from 'next/router'

import * as Accordion from '@radix-ui/react-accordion';

import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { UserIcon } from '@heroicons/react/24/outline'

import Description from '@/components/app/Description'

function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

export default function Page() {
  const router = useRouter()

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
                <h3 className="text-3xl text-gray-900 dark:text-white">{router.query.id}</h3>
              </li>
            </ul>

          </div>
        </div>
      </div >

      <div className="pl-4 pr-4 mt-4 md:ml-64">
        <div className="pl-4 pr-4 flex grid justify-items-center">
          <div className="w-full max-w-xl dark:text-white">

            <Accordion.Root
              className="rounded-md shadow-gray-400 shadow-[0_0_2px]"
              type="single"
              defaultValue="item-1"
              collapsible
            >
              <Accordion.Item value="head" className="mt-px overflow-hidden first:mt-0 first:rounded-t-md last:rounded-b-md focus-within:relative focus-within:z-10">
                <Accordion.Header className="flex">
                  <Accordion.Trigger className="flex h-[45px] flex-1 cursor-default items-center justify-between bg-white text-[15px] leading-none shadow-gray-400 shadow-[0_0_2px] outline-none group">

                    <ul className="flex flex-row w-full">
                      <li className="flex-none items-center">
                        <a href="/user/superfluid" onClick={onLinkClick} className="flex items-center p-2 dark:text-white">
                          <UserIcon className="flex-shrink-0 w-7 h-7 p-1 text-white bg-blue-600 rounded-full transition duration-75" />
                        </a>
                      </li>
                      <li className="flex-none items-center">
                        <a href="/user/superfluid" onClick={onLinkClick} className="flex items-center p-2 text-gray-900">
                          <span className="flex-1 text-lg font-medium whitespace-nowrap hover:underline">Superfluid</span>
                        </a>
                      </li>
                    </ul>

                    <a href={`/event/${router.query.id}`} onClick={onLinkClick} className="flex items-center p-2 text-gray-900">
                      <span className="flex-1 text-md text-green-400 font-medium whitespace-nowrap hover:underline">join now now</span>
                    </a>
                    <div className="py-3 cursor-pointer">
                      <ChevronDownIcon className="w-5 h-5 mx-2 text-gray-500 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180 group-hover:text-gray-900" />
                    </div>
                  </Accordion.Trigger>
                </Accordion.Header>

                <Accordion.Content className="bg-gray-50 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]">

                  <Description />
                  <Description />
                  <Description />

                </Accordion.Content>
              </Accordion.Item>

            </Accordion.Root>

          </div>
        </div>
      </div >
    </>
  );
};
