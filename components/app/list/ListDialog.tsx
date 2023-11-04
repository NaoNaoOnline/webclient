import { KeyboardEvent, MouseEvent, useState } from "react";

import * as Checkbox from "@radix-ui/react-checkbox";
import * as Dialog from "@radix-ui/react-dialog";

import { CheckIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { useCache } from "@/components/app/cache/CacheContext";

import DescriptionSearchObject from "@/modules/api/description/search/Object";
import EventSearchObject from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { ListCreateForm } from "@/components/app/list/create/ListCreateForm";
import { RuleCreateForm } from "@/components/app/list/create/RuleCreateForm";
import { ListSearchResponse } from "@/modules/api/list/search/Response";
import { UserSearchResponse } from "@/modules/api/user/search/Response";
import spacetime from "spacetime";

function onItemClick(e: MouseEvent<HTMLDivElement>) {
  e.stopPropagation();
}

interface Props {
  clos: () => void;                // close dialog callback
  desc: DescriptionSearchObject[];
  evnt: EventSearchObject;
  labl: LabelSearchResponse[];
  show: boolean;                   // show dialog
}

export default function ListDialog(props: Props) {
  const { list, addList, remList } = useCache();

  const [cate, setCate] = useState<LabelSearchResponse[]>([]);
  const [host, setHost] = useState<LabelSearchResponse[]>([]);
  const [like, setLike] = useState<UserSearchResponse[]>([]);
  const [salt, setSalt] = useState<string>(newSlt());
  const [sbmt, setSbmt] = useState<boolean>(false);
  const [slct, setSlct] = useState<ListSearchResponse[]>([]);
  const [user, setUser] = useState<UserSearchResponse[]>([]);

  return (
    <Dialog.Root
      open={props.show}
      onOpenChange={(ope: boolean) => {
        if (!ope) props.clos();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="bg-gray-900/25 fixed inset-0" />
        <Dialog.Content
          onClick={onItemClick}
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="bg-gray-50 dark:bg-gray-700 rounded-md p-4 w-[500px] h-[415px] shadow-gray-400 dark:shadow-black shadow-[0_0_2px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] focus:outline-none"
        >
          <Dialog.Title className="text-gray-900 dark:text-gray-50 text-md font-medium mb-6">
            Manage Lists
          </Dialog.Title>

          <div className="grid gap-x-4 grid-cols-10">
            <div className="relative w-full h-[270px] px-2 mb-6 col-span-5 overflow-y-auto">

              <h5 className="py-2 text-gray-900 dark:text-gray-50 text-md font-medium">Hosts</h5>

              {props.evnt.host(props.labl).map((x, i) => (
                <label
                  key={salt + ":host:" + x.labl}
                  className="flex text-sm p-2 leading-none truncate h-[32px] rounded-md text-gray-900 dark:text-gray-50 items-center select-none outline-none hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 cursor-pointer"
                  htmlFor={"host:" + x.labl}
                >
                  <Checkbox.Root
                    id={"host:" + x.labl}
                    onCheckedChange={(che: boolean | "indeterminate") => {
                      if (che === true) setHost((old: LabelSearchResponse[]) => [...old, x]);
                      if (che === false) setHost((old: LabelSearchResponse[]) => old.filter((y) => y.labl !== x.labl));
                    }}
                    className="w-4 h-4 bg-gray-700 mr-2 dark:bg-gray-50 items-center justify-center rounded-sm outline-none"
                  >
                    <Checkbox.Indicator>
                      <CheckIcon className="text-gray-50 dark:text-gray-900" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>

                  @{x.name}

                </label>
              ))}

              <h5 className="py-2 text-gray-900 dark:text-gray-50 text-md font-medium">Categories</h5>

              {props.evnt.cate(props.labl).map((x, i) => (
                <label
                  key={salt + ":cate:" + x.labl}
                  className="flex text-sm p-2 leading-none truncate h-[32px] rounded-md text-gray-900 dark:text-gray-50 items-center select-none outline-none hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 cursor-pointer"
                  htmlFor={"cate:" + x.labl}
                >
                  <Checkbox.Root
                    id={"cate:" + x.labl}
                    onCheckedChange={(che: boolean | "indeterminate") => {
                      if (che === true) setCate((old: LabelSearchResponse[]) => [...old, x]);
                      if (che === false) setCate((old: LabelSearchResponse[]) => old.filter((y) => y.labl !== x.labl));
                    }}
                    className="w-4 h-4 bg-gray-700 mr-2 dark:bg-gray-50 items-center justify-center rounded-sm outline-none"
                  >
                    <Checkbox.Indicator>
                      <CheckIcon className="text-gray-50 dark:text-gray-900" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>

                  #{x.name}

                </label>
              ))}

              <h5 className="py-2 text-gray-900 dark:text-gray-50 text-md font-medium">Added By</h5>

              {srtUser(props.evnt, props.desc).map((x, i) => (
                <label
                  key={salt + ":user:" + x.user}
                  className="flex text-sm p-2 leading-none truncate h-[32px] rounded-md text-gray-900 dark:text-gray-50 items-center select-none outline-none hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 cursor-pointer"
                  htmlFor={"user:" + x.user}
                >
                  <Checkbox.Root
                    id={"user:" + x.user}
                    onCheckedChange={(che: boolean | "indeterminate") => {
                      if (che === true) setUser((old: UserSearchResponse[]) => [...old, x]);
                      if (che === false) setUser((old: UserSearchResponse[]) => old.filter((y) => y.user !== x.user));
                    }}
                    className="w-4 h-4 bg-gray-700 mr-2 dark:bg-gray-50 items-center justify-center rounded-sm outline-none"
                  >
                    <Checkbox.Indicator>
                      <CheckIcon className="text-gray-50 dark:text-gray-900" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>

                  {x.user === props.evnt.user() && (
                    <span className="absolute right-4 items-center rounded px-[3px] text-xs font-medium bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400 border border-sky-500">
                      EC
                    </span>
                  )}

                  {x.name}

                </label>
              ))}

              <h5 className="py-2 text-gray-900 dark:text-gray-50 text-md font-medium">Liked By</h5>

              {srtUser(props.evnt, props.desc).map((x, i) => (
                <label
                  key={salt + ":like:" + x.user}
                  className="flex text-sm p-2 leading-none truncate h-[32px] rounded-md text-gray-900 dark:text-gray-50 items-center select-none outline-none hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50 cursor-pointer"
                  htmlFor={"like:" + x.user}
                >
                  <Checkbox.Root
                    id={"like:" + x.user}
                    onCheckedChange={(che: boolean | "indeterminate") => {
                      if (che === true) setLike((old: UserSearchResponse[]) => [...old, x]);
                      if (che === false) setLike((old: UserSearchResponse[]) => old.filter((y) => y.user !== x.user));
                    }}
                    className="w-4 h-4 bg-gray-700 mr-2 dark:bg-gray-50 items-center justify-center rounded-sm outline-none"
                  >
                    <Checkbox.Indicator>
                      <CheckIcon className="text-gray-50 dark:text-gray-900" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>

                  {x.user === props.evnt.user() && (
                    <span className="absolute right-4 items-center rounded px-[3px] text-xs font-medium bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400 border border-sky-500">
                      EC
                    </span>
                  )}

                  {x.name}

                </label>
              ))}

            </div>

            <div className="absolute w-[1px] top-[15%] right-[50%] h-[65%] bg-gray-300 dark:bg-gray-600"></div>

            <div className="relative w-full max-h-[270px] px-2 mb-6 col-span-5">
              <ListCreateForm
                done={(lis: ListSearchResponse) => addList(lis)}
                fail={(lis: ListSearchResponse) => remList(lis)}
                list={list}
                salt={salt}
                slct={(lis: ListSearchResponse[]) => setSlct(lis)}
              />
            </div>
          </div>

          <button
            className="w-full px-5 py-2.5 text-gray-50 bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm text-center"
            disabled={sbmt}
            onClick={() => setSbmt(true)}
            onKeyDownCapture={(e: KeyboardEvent<HTMLButtonElement>) => e.stopPropagation()} // prevent LastPass bullshit
          >
            Save
          </button>

          <Dialog.Close asChild>
            <button
              className="py-3 outline-none group"
              type="button"
              aria-label="Close"
            >
              <XMarkIcon className="absolute top-4 right-4 w-5 h-5 text-gray-400 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-50" />
            </button>
          </Dialog.Close>

          <RuleCreateForm
            cate={cate}
            done={() => {
              setCate([]);
              setHost([]);
              setLike([]);
              setSalt(newSlt());
              setSbmt(false)
              setUser([]);
            }}
            fail={() => {
              setCate([]);
              setHost([]);
              setLike([]);
              setSbmt(false)
              setUser([]);
            }}
            host={host}
            like={like}
            list={slct}
            sbmt={sbmt}
            user={user}
          />

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >
  );
};

function srtUser(evn: EventSearchObject, des: DescriptionSearchObject[]): UserSearchResponse[] {
  const usr: Record<string, boolean> = {};
  const uni: UserSearchResponse[] = [];

  for (const x of des) {
    if (!usr[x.user()]) {
      usr[x.user()] = true;
      uni.push({
        // intern
        crtd: "",
        user: x.user(),
        // public
        imag: "",
        name: x.name(),
      });
    }
  }

  uni.sort((x: UserSearchResponse, y: UserSearchResponse) => {
    if (evn.user() === x.user && evn.user() !== y.user) return -1;
    if (evn.user() !== x.user && evn.user() === y.user) return +1;

    if (x.name < y.name) return -1;
    if (x.name > y.name) return +1;
    return 0;
  });

  return uni;
}

const newSlt = function (): string {
  return String(spacetime.now().goto("GMT").epoch)
};
