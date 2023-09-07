import React from 'react';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

interface Props {
  chng: (dat: Date) => void;
  desc: string;
  dspl: (dat: Date) => string[];
  list: Date[];
  mint: Date | null;
  maxt: Date | null;
  name: string;
  pstn: string;
  slct: Date;
}

export default function TimePicker(props: Props) {
  let pstn = "left-[-285px]"
  if (props.pstn === "right") {
    pstn = "left-[105%]"
  }

  return (
    <div className="relative z-0 w-full mb-6">
      <label htmlFor={`${props.name}-input`} className="group relative inline-block mb-2 text-sm underline decoration-dashed cursor-pointer font-medium text-gray-900 dark:text-white">
        {ttlCas(props.name)}
        <div className={`absolute top-[-85%] ${pstn} ml-4 z-10 w-[250px] invisible group-hover:visible px-3 py-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900`}>
          {props.desc}
        </div>
      </label>

      <Select.Root
        name={`${props.name}-input`}
        onValueChange={(val: string) => {
          if (val !== "") {
            props.chng(new Date(parseInt(val, 10)));
          }
        }}
        value={props.slct.getTime().toString()}
      >
        <Select.Trigger
          className="block py-2 px-0 w-full text-sm text-gray-900 text-gray-900 dark:text-gray-50 text-left bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          aria-label={props.name}
        >
          <Select.Value className="h-[25px]" />
          <div className="absolute right-[15px] w-[35px] text-gray-900 dark:text-gray-50 inline-flex items-center justify-center">
            {props.dspl(props.slct)[1]}
          </div>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            align="center"
            className="overflow-hidden bg-gray-50 dark:bg-gray-700 rounded-md shadow-gray-400 dark:shadow-black shadow-[0_0_2px]"
            side="top"
          >
            <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-gray-50 dark:bg-gray-700 cursor-default">
              <ChevronUpIcon className="text-gray-900 dark:text-gray-50" />
            </Select.ScrollUpButton>

            <Select.Viewport className="p-[5px]">
              <Select.Group>
                {props.list.filter((x) => !(props.mint && x < props.mint) && !(props.maxt && x > props.maxt)).map((x, i) => (
                  <Select.Item
                    key={i}
                    className={`text-sm leading-none text-gray-900 dark:text-gray-50 rounded-md flex items-center h-[25px] px-[5px] relative select-none outline-none data-[highlighted]:bg-gray-200 data-[highlighted]:text-gray-900 dark:data-[highlighted]:bg-gray-800 dark:data-[highlighted]:text-white cursor-pointer ${x.getTime() === props.slct.getTime() ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-white" : ""}`}
                    value={x.getTime().toString()}
                  >
                    <Select.ItemText>
                      {props.dspl(x)[0]}
                    </Select.ItemText>
                    <div className="absolute right-[10px] w-[35px] text-gray-900 dark:text-gray-50 inline-flex items-center justify-center">
                      {props.dspl(x)[1]}
                    </div>
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Viewport>

            <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-gray-50 dark:bg-gray-700 cursor-default">
              <ChevronDownIcon className="text-gray-900 dark:text-gray-50" />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root >
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
