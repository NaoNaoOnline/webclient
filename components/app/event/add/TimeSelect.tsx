import { useRef, useState } from "react";

import { Command } from "cmdk";
import spacetime, { Spacetime } from "spacetime";

import { Zone } from "@/modules/date/TimeZone";

interface Props {
  chng: (dat: Spacetime) => void;
  desc: string;
  dspl: (dat: Spacetime) => string[];
  list: Spacetime[];
  name: string;
  slct: Spacetime;
  span: string;
  zind: string;
  zone: Zone;
}

export default function TimeSelect(props: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const inpt = useRef<HTMLInputElement | null>(null);
  const offs: string = spacetime().goto(props.zone.iana).format("offset");

  // Render the item components to make them available to the combobox component
  // below.
  const item = props.list.map((x, j) => (
    <Command.Item
      key={j}
      className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[selected]:bg-gray-200 data-[selected]:text-gray-900 dark:data-[selected]:bg-gray-800 dark:data-[selected]:text-gray-50 cursor-pointer"
      onSelect={() => {
        setOpen(false);
        inpt?.current?.blur();
        props.chng(x);
      }}
    >
      <div className="relative">
        <span className="">
          {props.dspl(x)[0]}
        </span>
        <span className="absolute right-0">
          {props.dspl(x)[1]}
        </span>
      </div>
    </Command.Item>
  ));

  return (
    <div className={`relative w-full mb-6 ${props.span} ${props.zind}`}>
      <label
        htmlFor={`${props.name}-input`}
        className="group relative inline-block mb-2 text-sm underline decoration-dashed cursor-pointer font-medium text-gray-900 dark:text-gray-50"
        onClick={() => inpt?.current?.focus()}
      >
        {ttlCas(props.name)}
        <div className="absolute top-[-85%] left-[105%] ml-4 z-10 w-[178px] invisible group-hover:visible p-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-gray-50 dark:text-gray-900">
          {props.desc}
        </div>
      </label>

      <Command
        loop={true}
        shouldFilter={false}
      >
        <div className="relative">
          <Command.Input
            className="relative py-2 px-0 w-full text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 cursor-pointer peer"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
                inpt?.current?.blur();
              }
            }}
            value={props.dspl(props.slct)[0]}
            onClick={() => {
              setOpen(true);
            }}
            onFocus={() => {
              setOpen(true);
            }}
            onBlur={() => {
              setOpen(false);
            }}
            readOnly={true}
            ref={inpt}
          />
          <input
            type="hidden"
            name={`${props.name}-input`}
            value={props.slct.format("iso").slice(0, -6) + offs}
          />
          <span
            className="absolute py-2 px-0 right-0 text-sm bg-transparent appearance-none text-gray-400 dark:text-gray-500"
          >
            {props.dspl(props.slct)[1]}
          </span>
        </div>
        {open && (
          <Command.List
            className={`absolute top-[70px] ${props.zind} w-full max-h-[154px] overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-b-md p-[5px] shadow-gray-400 dark:shadow-black shadow-[0_0_2px]`}
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
              e.preventDefault();
            }}
          >

            {item}

          </Command.List>
        )}
      </Command>
    </div>
  );
}

// ttlCas returns the title case of the input string.
function ttlCas(str: string): string {
  if (str.length === 0) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
