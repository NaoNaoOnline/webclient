import { MutableRefObject, useEffect, useRef, useState } from "react";

import Link from "next/link";

import spacetime from "spacetime";

import { RiDeleteBinLine } from "react-icons/ri";
import { MdNotificationsOff } from "react-icons/md";
import { MdOutlineNotificationAdd } from "react-icons/md";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

import { HomeLineIcon } from "@/components/app/icon/base/HomeLineIcon";
import { InfoCircleIcon } from "@/components/app/icon/base/InfoCircleIcon";
import { ListUnorderedIcon } from "@/components/app/icon/base/ListUnorderedIcon";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { useCache } from "@/components/app/cache/CacheProvider";
import { DeleteButton } from "@/components/app/button/DeleteButton";
import { ListHeader } from "@/components/app/layout/ListHeader";
import { ListSeparator } from "@/components/app/layout/ListSeparator";
import { RowGrid } from "@/components/app/layout/RowGrid";
import { ListUpdateForm } from "@/components/app/list/page/update/ListUpdateForm";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { ListDelete } from "@/modules/api/list/delete/Delete";
import { ListSearchResponse } from "@/modules/api/list/search/Response";
import { ListUpdate } from "@/modules/api/list/update/Update";
import { UserUpdate } from "@/modules/api/user/update/Update";
import { UserSearch } from "@/modules/api/user/search/Search";
import { ListSearch } from "@/modules/api/list/search/Search";

interface Props {
  user: string;
}

export const ListOverview = (props: Props) => {
  const { atkn, uuid } = useAuth();
  const { list, remList, updList, user, updUser } = useCache();
  const { addErro, addInfo, addPgrs, addScss } = useToast();

  const [data, setData] = useState<ListSearchResponse[] | null>(null); // "data" due to naming conflict
  const [form, setForm] = useState<string>("");
  const [ldng, setLdng] = useState<boolean>(true);
  const [open, setOpen] = useState<string>("");
  const [ownr, setOwnr] = useState<boolean>(false);

  const clld: MutableRefObject<boolean> = useRef(false);

  const updateFeed = async (lis: ListSearchResponse) => {
    const fee: string = tglFee(lis);

    let pgrs: ProgressPropsObject = new ProgressPropsObject("Enabling List Notifications");
    let scss: SuccessPropsObject = new SuccessPropsObject("Oh yeah, you gonna get notified big time!");

    if (fee === "") {
      pgrs = new ProgressPropsObject("Disabling List Notifications");
      scss = new SuccessPropsObject("You'll not see them notification around here anymore I can bet you that!");
    }

    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [upd] = await ListUpdate([{ atkn: atkn, desc: "", feed: empZer(fee), list: lis.list }]);

      pgrs.setDone(() => {
        updList(lis, { ...lis, feed: fee });
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      addErro(new ErrorPropsObject("This shite again, Immabout to quit!", err as Error));
    }
  };

  const updateHome = async (hom: string) => {
    const pgrs: ProgressPropsObject = new ProgressPropsObject("Updating Home Page");
    const scss: SuccessPropsObject = new SuccessPropsObject("Yowser, we just keep on winning bb!");

    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [upd] = await UserUpdate([{ atkn: atkn, home: hom, name: "", user: uuid }]);

      pgrs.setDone(() => {
        updUser(user, { ...user, home: hom });
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      addErro(new ErrorPropsObject("This shite again, Immabout to quit!", err as Error));
    }
  };

  const deleteList = async (lis: ListSearchResponse) => {
    const pgrs: ProgressPropsObject = new ProgressPropsObject("Removing List");
    const scss: SuccessPropsObject = new SuccessPropsObject("You did'em dirty dis time, gone it is!");

    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [del] = await ListDelete([{ atkn: atkn, list: lis.list }]);

      pgrs.setDone(() => {
        remList(lis);
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      addErro(new ErrorPropsObject("Yeah no, this is not how anything works now isn't it!?", err as Error));
    }
  };

  useEffect(() => {
    const getData = async function (): Promise<void> {
      try {
        const [use] = await UserSearch([{ user: "", name: props.user, self: false }]);

        if (use.user === uuid) {
          setOwnr(true);
          setLdng(false);
          return;
        }

        const lis = await ListSearch([{ atkn: atkn, user: use.user }]);

        if (lis.length === 0) {
          setData([]);
          setLdng(false);
          return;
        }

        setData(lis);
        setLdng(false);
      } catch (err) {
        addErro(new ErrorPropsObject("Gotta say it how it is comrade, the end is near!", err as Error));
        setLdng(false);
      }
    };

    if (!clld.current) {
      clld.current = true;
      getData();
    }
  }, [props, atkn, uuid, addErro]);

  useEffect(() => {
    if (ownr) {
      setData(list);
    }
  }, [list, ownr]);

  if (ldng === true) return <></>;

  return (
    <>
      <ListHeader
        icon={<ListUnorderedIcon />}
        titl={<>Lists</>}
      />

      <ListSeparator />

      {!data || data.length === 0 && (
        <div className="m-8">
          <div className="flex mb-4 text-4xl justify-center">
            <span>🤨</span>
          </div>
          <div className="flex text-2xl justify-center">
            <span className="text-gray-500 dark:text-gray-500">There are no lists. Beavers ate them all!</span>
          </div>
        </div>
      )}

      {/*
      We keep the outer div to make the nth-child background colouring of the
      list content work properly to start at the first child. When we remove the
      outer div the ListHeader above becomes the first child and the alternating
      background colour change effectively flips.
       */}
      <div>
        {data && srtList(data).map((x, i) => (
          <RowGrid
            key={i}
            list={true}
            icon={
              <Tooltip
                desc={
                  <div>
                    <div>your current &quot;home&quot; page</div>
                    <div>undo using the house icon</div>
                  </div>
                }
                side="left"
                vsbl={ownr && x.list === user.home}
              >
                <InfoCircleIcon
                  className="w-5 h-5 text-gray-500 dark:text-gray-500"
                />
              </Tooltip>
            }
            subj={
              form !== x.list ? (
                <Link
                  href={"/event/list/" + x.list}
                  className={`
                  text-sm font-mono
                  truncate max-w-[250px]
                  hover:underline hover:underline-offset-2
                `}
                >
                  {x.desc}
                </Link>
              ) : (
                <ListUpdateForm
                  cncl={() => setForm("")}
                  done={(des: string) => {
                    if (des === x.desc) {
                      addInfo(new InfoPropsObject("Nothing to change here, don't worry mate. No biggie at all!"));
                    } else {
                      updList(x, { ...x, desc: des });
                    }
                    setForm("")
                  }}
                  list={x}
                />
              )
            }
            midl={
              form !== x.list ? (
                <Link
                  href={"/list/" + x.list}
                  className={`
                    text-sm font-mono
                    invisible group-hover/RowGrid:visible
                    hover:underline hover:underline-offset-2
                  `}
                >
                  View Rules
                </Link>
              ) : (
                undefined
              )
            }
            rigt={
              form !== x.list && ownr ? (
                <div
                  className="flex invisible group-hover/RowGrid:visible"
                >
                  <button
                    className="ml-3 outline-none invisible group-hover/RowGrid:visible"
                    type="button"
                    onClick={() => {
                      updateFeed(x);
                    }}
                  >
                    {!x.feed || x.feed === "" ? (
                      <MdOutlineNotificationAdd
                        className={`
                           w-5 h-5 text-gray-500 dark:text-gray-500
                           hover:text-gray-900 dark:hover:text-gray-50
                        `}
                      />
                    ) : (
                      <MdNotificationsOff
                        className={`
                           w-5 h-5 text-gray-500 dark:text-gray-500
                           hover:text-gray-900 dark:hover:text-gray-50
                        `}
                      />
                    )}
                  </button>

                  <button
                    className="ml-3 outline-none invisible group-hover/RowGrid:visible"
                    type="button"
                    onClick={() => {
                      setForm(x.list);
                    }}
                  >
                    <PencilSquareIcon
                      className={`
                       w-5 h-5 text-gray-500 dark:text-gray-500
                       hover:text-gray-900 dark:hover:text-gray-50
                    `}
                    />
                  </button>

                  <button
                    className="ml-3 outline-none invisible group-hover/RowGrid:visible"
                    type="button"
                    onClick={() => {
                      updateHome(x.list === user.home ? "/" : x.list);
                    }}
                  >
                    <HomeLineIcon
                      className={`
                       w-5 h-5 text-gray-500 dark:text-gray-500
                       hover:text-gray-900 dark:hover:text-gray-50
                    `}
                    />
                  </button>

                  <button
                    className="ml-3 outline-none invisible group-hover/RowGrid:visible"
                    type="button"
                    onClick={() => {
                      setOpen(x.list);
                    }}
                  >
                    <RiDeleteBinLine
                      className={`
                       w-5 h-5 text-gray-500 dark:text-gray-500
                       hover:text-gray-900 dark:hover:text-gray-50
                    `}
                    />
                  </button>

                  <DeleteButton
                    actn={() => deleteList(x)}
                    clse={() => setOpen("")}
                    desc="This cannot be undone. We'll smash it the fuck to bits."
                    open={open === x.list}
                    titl={"Delete List " + x.desc}
                  />
                </div>
              ) : (
                undefined
              )
            }
          />
        ))}
      </div >
    </>
  );
};

const srtList = (lis: ListSearchResponse[]): ListSearchResponse[] => {
  lis.sort((x: ListSearchResponse, y: ListSearchResponse) => {
    if (x.desc < y.desc) return -1;
    if (x.desc > y.desc) return +1;
    return 0;
  });

  return lis;
};

const empZer = (str: string): string => {
  if (str === "") return "0";
  return str
};

// tglFee receives a list object and returns the toggled state for a list update
// request that intents to modify the list's feed timestamp. The purpose of the
// update process is to either enable or disable notifications. If the given
// list object has a feed timestamp set already, then we want to disable
// notifications for the given list, and return the zero value. If the given
// list object does not have a feed timestamp set already, then we want to
// enable notifications for the given list, and return the current unix
// timestamp in seconds.
const tglFee = (lis: ListSearchResponse): string => {
  if (lis.feed && lis.feed !== "") return "";

  const now: string = Math.floor(spacetime.now().epoch / 1000).toString();

  return now;
};
