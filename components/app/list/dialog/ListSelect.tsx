import { KeyboardEvent, useEffect, useRef, useState } from "react";

import { Command } from "cmdk";

import * as Checkbox from "@radix-ui/react-checkbox";

import { RiCheckLine } from "react-icons/ri";

import { ListSearchResponse } from "@/modules/api/list/search/Response";

interface Props {
  clis: (des: string) => void;               // create list callback
  list: ListSearchResponse[];                // existing user lists
  salt: string;                              // random salt to force checkboxes to re-render
  slct: (lis: ListSearchResponse[]) => void; // selected lists
}

export function ListSelect(props: Props) {
  const [list, setList] = useState<ListSearchResponse[]>([]);
  const [salt, setSalt] = useState<string>("");
  const [slct, setSlct] = useState<ListSearchResponse[]>([]);
  const [srch, setSrch] = useState<string>("");

  const inpt = useRef<HTMLInputElement | null>(null);

  const srtd = list
    .filter((x) => {
      return x.desc.toLocaleLowerCase().includes(srch.toLocaleLowerCase());
    })
    .sort((x: ListSearchResponse, y: ListSearchResponse) => {
      if (x.desc < y.desc) return -1;
      if (x.desc > y.desc) return 1;

      return 0;
    });

  // Render the item components to make them available to the combobox component
  // below.
  const item = srtd.map((x, i) => {
    // If the user searches for a list and the already selected lists are not
    // part of the search query, they lose their checked state. Here we track
    // the checked state and apply to the item.
    let chck: boolean = slct && slct.includes(x) ? true : false;

    // onClick is some ugly hack to make clicking directly on the checkbox icon
    // work. For some reason the current setup does not manage the checked state
    // properly when the box icon is clicked. Clicking anywhere on the item and
    // the label work just fine. There wasn't a great idea that fixed the issue
    // easily so this is just a workaround. If somebody can improve this awful
    // situation please create a pull request.
    const onClick = () => {
      {
        chck = !chck;
      }
    };

    const onSelect = () => {
      setSlct((old: ListSearchResponse[]) => {
        if (old.length !== 0 && chck === false) return [...old, x];
        if (old.length === 0 && chck === false) return [x];
        if (old.length !== 0 && chck === true) return old.filter((y) => x.list !== y.list);
        return old;
      });

      setSrch("");
    };

    const onCheckedChange = (che: boolean | "indeterminate") => {
      {
        chck = !che;
      }

      setSlct((old: ListSearchResponse[]) => {
        if (old.length !== 0 && che === true && !old.includes(x)) return [...old, x];
        if (old.length === 0 && che === true) return [x];
        if (old.length !== 0 && che === false) return old.filter((y) => x.list !== y.list);
        return old;
      });
    };

    return (
      <Command.Item
        key={salt + ":" + i}
        value={JSON.stringify(x)}
        className="flex text-sm p-2 rounded-md text-gray-900 dark:text-gray-50 items-center select-none outline-none data-[selected]:bg-gray-200 data-[selected]:text-gray-900 dark:data-[selected]:bg-gray-800 dark:data-[selected]:text-gray-50 cursor-pointer"
        onSelect={onSelect}
      >
        <Checkbox.Root
          className="flex-none w-4 h-4 bg-gray-700 mr-2 dark:bg-gray-50 items-center justify-center rounded-sm outline-none"
          checked={chck}
          onCheckedChange={onCheckedChange}
          onClick={onClick}
          id={salt + ":" + i}
        >
          <Checkbox.Indicator>
            <RiCheckLine className="text-gray-50 dark:text-gray-900" />
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span
          className="text-sm truncate max-w-[175px]"
        >
          {x.desc}
        </span>
      </Command.Item >
    );
  });

  const onCreate = (val: string) => {
    props.clis(val);
    setList((old: ListSearchResponse[]) => {
      return [...old, { crtd: "", list: "", user: "", desc: val, }];
    });
    setSrch("");
  };

  useEffect(() => {
    setList(props.list);
  }, [props.list]);

  useEffect(() => {
    setSlct([]);
    setSalt(props.salt);
  }, [props.salt]);

  // Propagate any change in the selected items to the outside.
  useEffect(() => {
    if (slct) {
      props.slct(slct);
    }
  }, [props, slct]);

  return (
    <Command
      loop={true}
      shouldFilter={false}
    >
      <div className="relative">
        <Command.Input
          className="mb-2 py-2 px-0 w-full text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();

              if (inpt.current && srch !== "") {
                inpt.current.value = "";
              }

              if (inpt.current && srch === "") {
                inpt.current.blur();
              }

              setSrch("");
            }

            if (e.key === "Enter") {
              if (srtd.length === 0) {
                onCreate(srch);
              }
            }
          }}
          onValueChange={(val: string) => {
            setSrch(val);
          }}
          placeholder="search or create list"
          ref={inpt}
          value={srch}
        />
      </div>

      <Command.List
        className="w-full max-h-[254px] bg-gray-50 dark:bg-gray-700 overflow-y-auto"
        onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
          e.preventDefault();
        }}
      >
        <Command.Empty className="py-1 text-sm text-center">
          <button
            className="flex-1 w-full py-2.5 text-gray-50 text-sm font-medium rounded-lg text-center bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-500"
            onClick={() => onCreate(srch)}
            onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
          >
            Create
          </button>
        </Command.Empty>

        {item}

      </Command.List>

    </Command>
  );
};
