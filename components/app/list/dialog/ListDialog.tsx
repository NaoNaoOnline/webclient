import { KeyboardEvent, useState } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import * as Separator from "@radix-ui/react-separator";

import spacetime from "spacetime";

import { XMarkIcon } from "@heroicons/react/24/outline";

import { useCache } from "@/components/app/cache/CacheProvider";

import { ListCreateForm } from "@/components/app/list/dialog/create/ListCreateForm";
import { RuleCreateForm } from "@/components/app/list/dialog/create/RuleCreateForm";
import { RuleSelect } from "@/components/app/list/dialog/RuleSelect";
import { DialogTitle } from "@/components/app/list/dialog/DialogTitle";

import DescriptionSearchObject from "@/modules/api/description/search/Object";
import EventSearchObject from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { ListSearchResponse } from "@/modules/api/list/search/Response";
import { UserSearchResponse } from "@/modules/api/user/search/Response";

interface Props {
  clos: () => void;                // close dialog callback
  desc: DescriptionSearchObject[];
  evnt: EventSearchObject;
  labl: LabelSearchResponse[];
  sdlg: boolean;                   // show list dialog
}

export function ListDialog(props: Props) {
  const { list, addList, remList } = useCache();

  const [cate, setCate] = useState<LabelSearchResponse[]>([]);
  const [evnt, setEvnt] = useState<EventSearchObject[]>([]);
  const [host, setHost] = useState<LabelSearchResponse[]>([]);
  const [incl, setIncl] = useState<boolean>(true);
  const [like, setLike] = useState<UserSearchResponse[]>([]);
  const [salt, setSalt] = useState<string>(newSlt());
  const [sbmt, setSbmt] = useState<boolean>(false);
  const [slct, setSlct] = useState<ListSearchResponse[]>([]);
  const [user, setUser] = useState<UserSearchResponse[]>([]);

  return (
    <Dialog.Root
      open={props.sdlg}
      onOpenChange={(ope: boolean) => {
        if (!ope) props.clos();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed bg-gray-900/50 pt-10 inset-0">
          <Dialog.Content
            onInteractOutside={(e) => e.preventDefault()}
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="relative w-full max-w-xl min-h-[400px] bg-gray-50 dark:bg-gray-700 mt-7 mx-auto p-4 rounded-md justify-items-center shadow-gray-400 dark:shadow-black shadow-[0_0_2px] focus:outline-none"
          >

            <DialogTitle
              incl={incl}
              slct={(val: string) => setIncl(val === "incl")}
            />

            <div className="flex flex-row w-full h-[300px]">
              <div className="flex-1 w-full overflow-y-auto">

                <h5 className="py-2 text-gray-900 dark:text-gray-50 text-sm font-medium">This Event</h5>

                <RuleSelect
                  key={salt + ":evnt:" + props.evnt.evnt()}
                  chck={(che: boolean | "indeterminate") => {
                    if (che === true) setEvnt([props.evnt]);
                    if (che === false) setEvnt([]);
                  }}
                  name="evnt"
                  rsrc={props.evnt.evnt()}
                  salt={salt}
                  text={"[" + props.evnt.evnt().slice(-4) + "]"}
                />

                <h5 className="py-2 text-gray-900 dark:text-gray-50 text-sm font-medium">Hosted By</h5>

                {props.evnt.host(props.labl).map((x, i) => (
                  <RuleSelect
                    key={salt + ":host:" + x.labl}
                    chck={(che: boolean | "indeterminate") => {
                      if (che === true) setHost((old: LabelSearchResponse[]) => [...old, x]);
                      if (che === false) setHost((old: LabelSearchResponse[]) => old.filter((y) => y.labl !== x.labl));
                    }}
                    name="host"
                    prfx="@"
                    rsrc={x.labl}
                    salt={salt}
                    text={x.name}
                  />
                ))}

                <h5 className="py-2 text-gray-900 dark:text-gray-50 text-sm font-medium">Talking About</h5>

                {props.evnt.cate(props.labl).map((x, i) => (
                  <RuleSelect
                    key={salt + ":cate:" + x.labl}
                    chck={(che: boolean | "indeterminate") => {
                      if (che === true) setCate((old: LabelSearchResponse[]) => [...old, x]);
                      if (che === false) setCate((old: LabelSearchResponse[]) => old.filter((y) => y.labl !== x.labl));
                    }}
                    name="cate"
                    prfx="#"
                    rsrc={x.labl}
                    salt={salt}
                    text={x.name}
                  />
                ))}

                <h5 className="py-2 text-gray-900 dark:text-gray-50 text-sm font-medium">Added By</h5>

                {srtUser(props.evnt, props.desc).map((x, i) => (
                  <RuleSelect
                    key={salt + ":user:" + x.user}
                    crtr={props.evnt.user() === x.user}
                    chck={(che: boolean | "indeterminate") => {
                      if (che === true) setUser((old: UserSearchResponse[]) => [...old, x]);
                      if (che === false) setUser((old: UserSearchResponse[]) => old.filter((y) => y.user !== x.user));
                    }}
                    name="user"
                    rsrc={x.user}
                    salt={salt}
                    text={x.name}
                  />
                ))}

                <h5 className="py-2 text-gray-900 dark:text-gray-50 text-sm font-medium">Liked By</h5>

                {srtUser(props.evnt, props.desc).map((x, i) => (
                  <RuleSelect
                    key={salt + ":like:" + x.user}
                    crtr={props.evnt.user() === x.user}
                    chck={(che: boolean | "indeterminate") => {
                      if (che === true) setLike((old: UserSearchResponse[]) => [...old, x]);
                      if (che === false) setLike((old: UserSearchResponse[]) => old.filter((y) => y.user !== x.user));
                    }}
                    name="like"
                    rsrc={x.user}
                    salt={salt}
                    text={x.name}
                  />
                ))}

              </div>

              <Separator.Root
                className="bg-gray-300 dark:bg-gray-600 mx-3 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px"
                decorative
                orientation="vertical"
              />

              <div className="flex-1 w-full overflow-y-hidden">
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
              className="w-full mt-4 px-5 py-2.5 rounded-lg text-sm font-medium text-center text-gray-50 bg-gray-200 dark:bg-gray-800 enabled:bg-blue-700 enabled:dark:bg-blue-700 enabled:hover:bg-blue-800 enabled:dark:hover:bg-blue-800 focus:outline-none"
              disabled={
                sbmt ||                 // disable if already submitted
                slct.length === 0 ||    // disable if no list is selected
                (                       // disable if no rule is selected
                  cate.length === 0 &&
                  evnt.length === 0 &&
                  host.length === 0 &&
                  like.length === 0 &&
                  user.length === 0
                )
              }
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
                setEvnt([]);
                setHost([]);
                setLike([]);
                setSbmt(false)
                setSlct([]);
                setUser([]);

                // We set a new random salt to reset all the checkboxes once we
                // have successfully created a new list with valid rules.
                setSalt(newSlt());
              }}
              evnt={evnt}
              fail={() => {
                setCate([]);
                setEvnt([]);
                setHost([]);
                setLike([]);
                setSbmt(false)
                setSlct([]);
                setUser([]);
              }}
              incl={incl}
              host={host}
              like={like}
              list={slct}
              sbmt={sbmt}
              user={user}
            />

          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root >
  );
};

const newSlt = function (): string {
  return String(spacetime.now().goto("GMT").epoch)
};

const srtUser = (evn: EventSearchObject, des: DescriptionSearchObject[]): UserSearchResponse[] => {
  // It may just happen that there are no descriptions for an intermittendly. So
  // we guard against it and return an empty list.
  if (!des || des.length === 0) return [];

  const usr: Record<string, boolean> = {};
  const uni: UserSearchResponse[] = [];

  for (const x of des) {
    if (!usr[x.user()]) {
      usr[x.user()] = true;
      uni.push({
        // intern
        crtd: "",
        prem: "",
        user: x.user(),
        // public
        home: "",
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
};
