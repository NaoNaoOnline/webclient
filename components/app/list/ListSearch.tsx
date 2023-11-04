import { KeyboardEvent, MutableRefObject, useEffect, useRef, useState } from "react";

import { Command } from "cmdk";

import * as Checkbox from "@radix-ui/react-checkbox";

import { CheckIcon } from "@heroicons/react/24/outline";

import { ListSearchResponse } from "@/modules/api/list/search/Response";

interface Props {
  clis: (des: string) => void;               // create list callback
  list: ListSearchResponse[];                // existing user lists
  salt: string;                              // random salt to force checkboxes to re-render
  slct: (lis: ListSearchResponse[]) => void; // selected lists
}

export default function ListSearch(props: Props) {
  const [list, setList] = useState<ListSearchResponse[]>([]);
  const [salt, setSalt] = useState<string>("");
  const [slct, setSlct] = useState<ListSearchResponse[]>([]);
  const [srch, setSrch] = useState<string>("");

  const inpt = useRef<HTMLInputElement | null>(null);

  // After the creation of a new list, the new list is provided with props.list
  // and must be used to replace the temporary local copy that we added
  // optimistically upon list creation below. The two copies of local state
  // hooks that we need to cover are list and slct. If we do not update the
  // local copies a user may create a list and add rules to it, running into the
  // problem that the backend rejects the call because the rules shown to the
  // backend do not include a list ID, since we only added the loist description
  // to our local copy below.
  useEffect(() => {
    setList(old => {
      const lis = [...old];

      for (const x of props.list) {
        const ind = lis.findIndex((y: ListSearchResponse) => (x.list !== "" && y.list !== "" && x.list === y.list) || ((x.list === "" || y.list === "") && x.desc === y.desc));

        if (ind !== -1) {
          lis[ind] = x;
        } else {
          lis.push(x);
        }
      }

      return lis;
    });

    setSlct(old => {
      const lis = [...old];

      for (const x of props.list) {
        const ind = lis.findIndex((y: ListSearchResponse) => (x.list !== "" && y.list !== "" && x.list === y.list) || ((x.list === "" || y.list === "") && x.desc === y.desc));

        if (ind !== -1) {
          lis[ind] = x;
        }
      }

      return lis;
    });
  }, [props.list]);

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
      if (che === true) {
        chck = true;
      }

      if (che === false) {
        chck = false;
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
        className="grid gap-x-4 grid-cols-10 text-sm p-2 rounded-md text-gray-900 dark:text-gray-50 items-center select-none outline-none data-[selected]:bg-gray-200 data-[selected]:text-gray-900 dark:data-[selected]:bg-gray-800 dark:data-[selected]:text-gray-50 cursor-pointer"
        onSelect={onSelect}
      >
        <Checkbox.Root
          className="col-span-1 w-4 h-4 bg-gray-700 dark:bg-gray-50 items-center justify-center rounded-sm outline-none"
          checked={chck}
          onCheckedChange={onCheckedChange}
          id={String(i)}
        >
          <Checkbox.Indicator>
            <CheckIcon className="text-gray-50 dark:text-gray-900" />
          </Checkbox.Indicator>
        </Checkbox.Root>
        <label className="col-span-9 text-sm leading-none truncate cursor-pointer" htmlFor={String(i)}>
          {x.desc}
        </label>
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
    setSlct([]);
    setSalt(props.salt);
  }, [props.salt]);

  // Propagate any change in the selected items to the outside.
  useEffect(() => {
    if (slct) {
      props.slct(slct);
    }
  }, [props, slct]);

  useEffect(() => {
    // The goal here is to auto-focus on the input text field, which we
    // conditionally render below. The user clicks a button to add a new
    // description to an event and should then be able to write right away as
    // soon as the input text field is rendered. Using the timeout of some
    // milliseconds was the only way this behaviour could be achieved reliably
    // for the user. If somebody knows a better way of doing this, please create
    // a pull request.
    setTimeout(() => {
      if (inpt.current) {
        inpt.current.focus();
      }
    }, 100);
  }, []);

  return (
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
        className="w-full h-[232px] pt-2 bg-gray-50 dark:bg-gray-700 overflow-y-auto"
        onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
          e.preventDefault();
        }}
      >
        <Command.Empty className="py-2 text-sm text-center">
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
