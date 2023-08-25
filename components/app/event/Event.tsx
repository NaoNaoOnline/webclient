import "flowbite";
import React, { useState, MouseEvent } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { UserIcon } from '@heroicons/react/24/outline'

import Form from '@/components/app/description/Form'
import Description from '@/components/app/description/Description'

import { DescriptionSearchResponse } from '@/modules/api/description/search/Response';
import { EventSearchObject } from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { RatingSearchResponse } from '@/modules/api/rating/search/Response';
import { SearchO_Object_Public_Rtng } from '@naonaoonline/apitscode/src/description/search';

function onItemClick(e: MouseEvent<HTMLDivElement>) {
  e.stopPropagation();
}

function onLinkClick(e: MouseEvent<HTMLAnchorElement>) {
  e.stopPropagation();
}

interface Props {
  atkn: string;
  evnt: EventSearchObject;
  desc: DescriptionSearchResponse[];
  labl: LabelSearchResponse[];
  rtng: RatingSearchResponse[];
}

export default function Event(props: Props) {
  const { user } = useUser();

  const [form, setForm] = useState<boolean>(false);
  const [xpnd, setXpnd] = useState<boolean>(false);

  const dateTime = (uni: number): string => {
    const dat = new Date(uni * 1000);

    const day = String(dat.getDate()).padStart(2, '0');
    const mon = String(dat.getMonth() + 1).padStart(2, '0');
    const yea = String(dat.getFullYear()).slice(-2);
    const hou = String(dat.getHours()).padStart(2, '0');
    const min = String(dat.getMinutes()).padStart(2, '0');

    return `${day}.${mon}.${yea} ${hou}:${min}`;
  };

  const doneFunc = (des: string) => {
    props.desc.push({
      // local
      imag: user?.picture || "",
      name: user?.nickname || user?.name || "",
      // intern
      crtd: "",
      desc: "",
      user: user?.uuid || "",
      // public
      evnt: props.evnt.evnt(),
      rtng: {},
      text: des,
    });
  };

  const linkText = (tim: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const dif = tim - now;

    const min = 60;
    const hou = 60 * min;
    const day = 24 * hou;
    const wee = 7 * day;
    const mon = 30 * day;

    if (dif <= 0) {
      return "join now now";
    } else if (dif <= hou) {
      return "coming up next";
    } else if (dif <= day) {
      return "later today";
    } else if (dif <= 2 * day) {
      return "tomorrow";
    } else if (dif <= wee) {
      return "next week";
    } else if (dif <= mon) {
      return "next month";
    } else {
      return "in the future";
    }
  }

  props.desc.sort((a: DescriptionSearchResponse, b: DescriptionSearchResponse) => {
    // Sort descriptions by cumulative rating amount in descending order at
    // first.
    {
      const xam = Object.values(a.rtng).reduce((tot: number, obj: SearchO_Object_Public_Rtng) => tot + obj.amnt, 0);
      const yam = Object.values(b.rtng).reduce((tot: number, obj: SearchO_Object_Public_Rtng) => tot + obj.amnt, 0);

      if (yam !== xam) {
        return yam - xam;
      }
    }

    // Sort descriptions by creation time in ascending order as secondary
    // measure.
    {
      const xti = parseInt(a.crtd, 10);
      const yti = parseInt(b.crtd, 10);

      return xti - yti;
    }
  });

  return (
    <>
      <div
        onClick={() => window.location.href = "/event/" + props.evnt.evnt()}
        className="relative rounded-t-md shadow-gray-400 dark:shadow-black shadow-[0_0_2px] overflow-hidden cursor-pointer"
      >
        <div className="flex flex-row w-full dark:bg-gray-700 items-center justify-between bg-white outline-none">
          {props.labl && (
            <a
              href={`/host/${props.evnt?.host(props.labl)[0]}`}
              onClick={onLinkClick}
              className="flex items-center pl-2"
            >
              <UserIcon className="w-7 h-7 p-1 text-gray-50 bg-blue-600 rounded-full" />
            </a>
          )}

          <div className="flex flex-row w-full">
            {props.labl && (
              props.evnt?.host(props.labl).map((x, i) => (
                <a key={i} href={`/host/${x}`} onClick={onLinkClick} className="flex items-center pl-2 py-2 text-lg font-medium whitespace-nowrap text-gray-900 dark:text-gray-50 hover:underline">
                  {x}
                </a>
              ))
            )}
          </div>

          <a
            href={props.evnt.actv() ? props.evnt.link() : `/event/${props.evnt.evnt()}`}
            onClick={onLinkClick}
            target={props.evnt.actv() ? "_blank" : "_self"}
            className={`relative inline-block flex items-center p-2 whitespace-nowrap text-md font-medium hover:underline group ${props.evnt.actv() ? "text-green-400" : "text-gray-400"}`}
          >
            <div className="absolute top-[5%] right-[105%] ml-2 z-10 whitespace-nowrap invisible group-hover:visible px-3 py-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900">
              {dateTime(props.evnt.time())}
              {` - `}
              {dateTime(props.evnt.dura())}
            </div>
            {props.evnt.actv() ? linkText(props.evnt.time()) : "already happened"}
          </a>

          <button
            className={`py-3 outline-none group ${props.desc.length > 1 ? "" : "cursor-default"}`}
            type="button"
            onClick={(evn: MouseEvent<HTMLButtonElement>) => {
              evn.stopPropagation();
              if (props.desc.length > 1) setXpnd(!xpnd);
            }}
          >
            <ChevronDownIcon className={`w-5 h-5 mx-2 ${props.desc.length > 1 ? "text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300" : "text-gray-200 dark:text-gray-600 cursor-default"}  ${xpnd ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      <div className="shadow-gray-400 dark:shadow-black shadow-[0_0_2px]">
        {!xpnd && (
          <Description desc={props.desc[0]} evnt={props.evnt} rtng={props.rtng} />
        )}
        {xpnd && (
          <>
            {props.desc.map((x, i) => (
              <Description key={i} desc={x} evnt={props.evnt} rtng={props.rtng} />
            ))}
          </>
        )}
        {form && (
          <Form atkn={props.atkn} cncl={() => setForm(false)} done={doneFunc} evnt={props.evnt.evnt()} />
        )}
      </div>

      <div
        onClick={() => window.location.href = "/event/" + props.evnt.evnt()}
        className="flex flex-1 rounded-b-md dark:bg-gray-700 items-center justify-between bg-white shadow-gray-400 dark:shadow-black shadow-[0_0_2px] outline-none cursor-pointer"
      >
        <div className="flex flex-row w-full">

          {props.labl && (
            props.evnt?.cate(props.labl).map((x, i) => (
              <a key={i} href={`/cate/${x}`} onClick={onLinkClick} className="flex items-center pl-2 py-2 text-sm font-medium text-sky-500 hover:underline">
                #{x}
              </a>
            ))
          )}

        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="py-3 outline-none group" type="button">
              <EllipsisHorizontalIcon className="w-5 h-5 mx-2 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              onClick={onItemClick}
              className="min-w-[220px] bg-gray-50 dark:bg-gray-700 rounded-md p-[5px] shadow-gray-400 dark:shadow-black shadow-[0_0_2px] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
              loop
            >

              <DropdownMenu.Item
                onSelect={() => setForm(true)}
                className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-white cursor-pointer"
              >
                Add Description
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-[1px] bg-gray-200 dark:bg-gray-800 my-[5px]" />

              <DropdownMenu.Item disabled className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-white cursor-pointer">
                Update Event
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-white cursor-pointer">
                Report Event
              </DropdownMenu.Item>
              <DropdownMenu.Item className="text-red-600 dark:text-red-600 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-red-600 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-red-600 cursor-pointer">
                Delete Event
              </DropdownMenu.Item>

            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </>
  );
};
