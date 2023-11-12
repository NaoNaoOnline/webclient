import { MutableRefObject, useEffect, useRef, useState } from "react";

import Link from "next/link";

import { RiDeleteBinLine } from "react-icons/ri";
import { RiHome4Line } from "react-icons/ri";
import { BiInfoCircle } from "react-icons/bi";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { useCache } from "@/components/app/cache/CacheProvider";
import { PageHeader } from "@/components/app/layout/PageHeader";
import { RowGrid } from "@/components/app/layout/RowGrid";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";
import { Tooltip } from "@/components/app/tooltip/Tooltip";

import { ListDelete } from "@/modules/api/list/delete/Delete";
import { ListSearchResponse } from "@/modules/api/list/search/Response";
import { UserUpdate } from "@/modules/api/user/update/Update";
import { UserSearch } from "@/modules/api/user/search/Search";
import { ListSearch } from "@/modules/api/list/search/Search";

interface Props {
  user: string;
}

export const ListOverview = (props: Props) => {
  const { list, remList, updList, user, updUser } = useCache();
  const { addErro, addInfo, addPgrs, addScss } = useToast();
  const { atkn, uuid } = useAuth();

  // TODO make list description editible for the owner
  const [form, setForm] = useState<string>("");
  const [data, setData] = useState<ListSearchResponse[] | null>(null); // "data" due to naming conflict
  const [ldng, setLdng] = useState<boolean>(true);
  const [ownr, setOwnr] = useState<boolean>(false);

  const clld: MutableRefObject<boolean> = useRef(false);

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
        updUser(user[0], { ...user[0], home: hom });
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

        const lis = await ListSearch([{ user: use.user }]);

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
  }, [props, addErro]);

  useEffect(() => {
    if (ownr) {
      setData(list);
    }
  }, [list, ownr]);

  if (ldng === true) return <></>;

  return (
    <>
      {!data || data.length === 0 && (
        <div className="m-8">
          <div className="flex mb-4 text-4xl justify-center">
            <span>🤨</span>
          </div>
          <div className="flex text-2xl justify-center">
            <span className="text-gray-400 dark:text-gray-500">There are no lists. Beavers ate them all!</span>
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
                vsbl={ownr && x.list === user[0].home}
              >
                <BiInfoCircle
                  className="w-5 h-5 text-gray-500 dark:text-gray-500"
                />
              </Tooltip>
            }
            subj={
              <Link
                href={"/event/list/" + x.list}
                className={`
                  text-sm font-mono
                  hover:underline hover:underline-offset-2
                `}
              >
                {x.desc}
              </Link>
            }
            midl={
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
            }
            rigt={
              ownr ? (
                <div
                  className="flex invisible group-hover/RowGrid:visible"
                >
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
                      updateHome(x.list === user[0].home ? "/" : x.list);
                    }}
                  >
                    <RiHome4Line
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
                      deleteList(x);
                    }}
                  >
                    <RiDeleteBinLine
                      className={`
                       w-5 h-5 text-gray-500 dark:text-gray-500
                       hover:text-gray-900 dark:hover:text-gray-50
                    `}
                    />
                  </button>
                </div>
              ) : (
                <></>
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
