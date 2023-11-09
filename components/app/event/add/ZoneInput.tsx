import { ReactNode, useEffect, useRef, useState } from "react";

import { Command } from "cmdk";

import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { Locl, Zone } from "@/modules/date/TimeZone";

interface Props {
  chng: (zon: Zone) => void;
  desc: ReactNode;
  name: string;
  span: string;
  zind: string;
  zone: Zone[];
}

export default function ZoneInput(props: Props) {
  const [last, setLast] = useState<string>(JSON.stringify(Locl.user));
  const [name, setName] = useState<string>(Locl.lowr.name);
  const [open, setOpen] = useState<boolean>(false);
  const [shrt, setShrt] = useState<string>(Locl.lowr.shrt);
  const [srch, setSrch] = useState<string>(JSON.stringify(Locl.user));

  const inpt = useRef<HTMLInputElement | null>(null);

  // Sort and filter the full list of timezones available and reduce the result
  // to the first 20 matching items.
  const srtd = props.zone
    .filter((x) => {
      // In completed state srch is a JSON object string
      if (srch[0] == "{") {
        return name.includes(x.lowr.name) || shrt.includes(x.lowr.shrt);
      }

      // If user search is in progress then srch might be some incomplete
      // written string like "pd".
      const lowr: string = srch.toLocaleLowerCase();
      return x.lowr.name.includes(lowr) || x.lowr.shrt.includes(lowr);
    })
    .slice(0, 20)
    .sort((x: Zone, y: Zone) => {
      if (x.lowr.shrt < y.lowr.shrt) return -1;
      if (x.lowr.shrt > y.lowr.shrt) return 1;

      if (x.lowr.name < y.lowr.name) return -1;
      if (x.lowr.name > y.lowr.name) return 1;

      return 0;
    });

  // Put the currently selected option at the top.
  const indx = srtd.findIndex((x: Zone) => JSON.stringify(x.user) === srch);
  if (indx !== -1) {
    srtd.unshift(srtd.splice(indx, 1)[0]);
  }

  // Render the item components to make them available to the combobox component
  // below.
  const item = srtd.map((x, j) => (
    <Command.Item
      key={j}
      value={JSON.stringify(x.lowr)}
      className="text-gray-900 dark:text-gray-50 text-sm rounded-md items-center p-2 select-none outline-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-400 data-[disabled]:pointer-events-none data-[selected]:bg-gray-200 data-[selected]:text-gray-900 dark:data-[selected]:bg-gray-800 dark:data-[selected]:text-gray-50 cursor-pointer"
      onSelect={() => {
        setLast(JSON.stringify(x.user));
        setName(x.lowr.name);
        setOpen(false);
        setShrt(x.lowr.shrt);
        setSrch(JSON.stringify(x.user));
        inpt?.current?.blur();
        props.chng(x);
      }}
    >
      <div className="relative">
        <span className="">
          {x.user.shrt}
        </span>
        <span className="absolute right-0">
          {x.user.name}
        </span>
      </div>
    </Command.Item>
  ));

  // We maintain the last known valid selection in case the user cancels a
  // search process intermittently. If the combobox closes and srch is not a
  // JSON string, we infer that no new option was selected, and thus the search
  // got aborted. In that case we set the srch, which is the working value
  // throughout the process, to last, which is what the user had selected
  // before, either by default or choice.
  useEffect(() => {
    if (!open && srch[0] !== "{") {
      setSrch(last);
    }
  }, [last, open, srch]);

  return (
    <div className={`relative w-full mb-6 ${props.span} ${props.zind}`}>

      <div className="relative z-10">
        <Tooltip
          desc={props.desc}
          side="right"
        >
          <label
            htmlFor={inpt?.current?.id}
            className="mb-2 text-sm underline decoration-dashed cursor-pointer font-medium text-gray-900 dark:text-gray-50"
            onClick={() => inpt?.current?.focus()}
          >
            {ttlCas(props.name)}
          </label>
        </Tooltip>
      </div>

      <Command
        loop={true}
        shouldFilter={false}
      >
        <div className="relative">
          <Command.Input
            className="relative py-2 px-0 w-full text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
                inpt?.current?.blur();
              }
            }}
            onValueChange={(val: string) => {
              if (val[0] !== "{") {
                setSrch(val);
              }
            }}
            value={srch[0] === "{" ? JSON.parse(srch).shrt : srch}
            onFocus={() => {
              inpt?.current?.select();
              setOpen(true);
            }}
            onBlur={() => {
              setOpen(false);
            }}
            ref={inpt}
          />
          {!open && (
            <span
              className="absolute py-2 px-0 right-0 text-sm bg-transparent appearance-none text-gray-400 dark:text-gray-500"
            >
              {srch[0] === "{" ? JSON.parse(srch).name : ""}
            </span>
          )}
        </div>
        {open && (
          <Command.List
            className="absolute top-[70px] z-20 w-full max-h-[154px] overflow-y-auto bg-gray-50 dark:bg-gray-700 rounded-b-md p-[5px] shadow-gray-400 dark:shadow-black shadow-[0_0_2px]"
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
              e.preventDefault();
            }}
          >
            <Command.Empty className="p-2 text-sm text-center">no timezone found</Command.Empty>

            {item}

          </Command.List>
        )}
      </Command>
    </div>
  );
};

// ttlCas returns the title case of the input string.
function ttlCas(str: string): string {
  if (str.length === 0) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
