import { MouseEvent, useState } from "react";

import Link from "next/link";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/outline";

import { useCache } from "@/components/app/cache/CacheContext";

import { ListDelete } from "@/modules/api/list/delete/Delete";
import { ListSearchResponse } from "@/modules/api/list/search/Response";

import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastContext";

import { useToken } from "@/components/app/token/TokenContext";
import { ListUpdateForm } from "./update/ListUpdateForm";

export function ListOverview() {
  const { list, remList, updList } = useCache();
  const { addErro, addInfo, addPgrs, addScss } = useToast();
  const { atkn } = useToken();

  const [form, setForm] = useState<string>("");

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

  return (
    <>
      {srtList(list).map((x, i) => (
        <ul key={i} className="flex flex-row w-full text-gray-900 rounded-lg dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700 group">
          {form === x.list && (
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
          )}

          {form !== x.list && (
            <>
              <Link
                key={i}
                href={"/list/" + x.list}
                className="flex p-3 items-center w-full hover:underline"
              >
                <li className="flex w-fit items-center whitespace-nowrap">
                  {x.desc}
                </li>
              </Link >

              <li className="flex items-center text-gray-400 dark:text-gray-500 invisible group-hover:visible">
                <button
                  className="pl-3 outline-none flex-shrink-0"
                  type="button"
                  onClick={(eve: MouseEvent<HTMLButtonElement>) => {
                    eve.preventDefault();
                    setForm(x.list);
                  }}
                >
                  <PencilSquareIcon className="w-5 h-5 text-gray-400 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" />
                </button>
              </li>

              <li className="flex items-center text-gray-400 dark:text-gray-500 invisible group-hover:visible">
                <button
                  className="px-3 outline-none flex-shrink-0"
                  type="button"
                  onClick={(eve: MouseEvent<HTMLButtonElement>) => {
                    eve.preventDefault();
                    deleteList(x);
                  }}
                >
                  <TrashIcon className="w-5 h-5 text-gray-400 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" />
                </button>
              </li>
            </>
          )}
        </ul>
      ))}
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
