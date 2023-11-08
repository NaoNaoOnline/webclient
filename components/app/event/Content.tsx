import { MouseEvent } from "react";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";

import { DescriptionCreateForm } from "@/components/app/description/create/DescriptionCreateForm";
import Description from "@/components/app/description/Description";

import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject } from "@/components/app/toast/InfoToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastContext";

import { useAuth } from "@/components/app/auth/AuthContext";

import { DescriptionDelete } from "@/modules/api/description/delete/Delete";
import DescriptionSearchObject from "@/modules/api/description/search/Object";
import { DescriptionUpdate } from "@/modules/api/description/update/Update";
import { DescriptionUpdateResponse } from "@/modules/api/description/update/Response";
import EventSearchObject from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

interface Props {
  cncl: () => void;
  dadd: (des: DescriptionSearchObject) => void;
  drem: (des: DescriptionSearchObject) => void;
  dupd: (des: DescriptionSearchObject) => void;
  evnt: EventSearchObject;
  desc: DescriptionSearchObject[];
  form: boolean;
  labl: LabelSearchResponse[];
  xpnd: boolean;
}

export default function Content(props: Props) {
  const { addErro, addInfo, addPgrs, addScss } = useToast();
  const { auth, atkn } = useAuth();
  const { user } = useUser();

  const info: InfoPropsObject = new InfoPropsObject("Please login to add your reaction, or the beavers will build a dam.");
  const pgrs: ProgressPropsObject = new ProgressPropsObject("Removing Description");
  const scss: SuccessPropsObject = new SuccessPropsObject("Bye bye baby, no more descriptions like that!");

  const descriptionDelete = async function (des: DescriptionSearchObject) {
    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [del] = await DescriptionDelete([{ atkn: atkn, desc: des.desc() }]);

      pgrs.setDone(() => {
        props.drem(des);
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      addErro(new ErrorPropsObject("Fog mey, it's even more over than we thought it was!", err as Error));
    }
  };

  const voteCreate = async function (des: DescriptionSearchObject): Promise<DescriptionUpdateResponse> {
    try {
      const [upd] = await DescriptionUpdate([{ atkn: atkn, desc: des.desc(), like: "add", text: "" }]);
      return upd;
    } catch (err) {
      addErro(new ErrorPropsObject("Darn it, the beavers don't want you to push that button right now!", err as Error));
      return Promise.reject(err);
    }
  };

  const voteDelete = async function (des: DescriptionSearchObject): Promise<DescriptionUpdateResponse> {
    try {
      const [upd] = await DescriptionUpdate([{ atkn: atkn, desc: des.desc(), like: "rem", text: "" }]);
      return upd;
    } catch (err) {
      addErro(new ErrorPropsObject("Oh no, the beavers don't want you to take it back like that!", err as Error));
      return Promise.reject(err);
    }
  };

  // radd is called as "on button add" callback, which is the event invoked when
  // the user clicks on a reaction icon in the reaction button component.
  //
  // radd is called as "on picker add" callback, which is the event invoked when
  // the user clicks on a reaction icon in the reaction picker component.
  const radd = (des: DescriptionSearchObject, use: boolean) => {
    if (!auth) {
      addInfo(info);
      return;
    }

    // If the user clicked on the reaction already, the button is not allowed to
    // have any effect anymore.
    if (use) return;

    // Add the like to the user's local copy optimistically.
    des.likeUpdt(true);
    props.dupd(des);

    voteCreate(des).then(
      (upd: DescriptionUpdateResponse) => { },
      // onrejected removes the temporary vote object from the user's local copy
      // since the backend could not process our request successfully.
      (rsn: any) => {
        // catch removes the added like from the user's local copy since the
        // backend could not process our request successfully.
        des.likeUpdt(false);
        props.dupd(des);
      },
    );
  };

  // rrem is called as "on button remove" callback, which is the event invoked when
  // the user clicks on a reaction icon in the reaction button component.
  const rrem = (des: DescriptionSearchObject, use: boolean) => {
    if (!auth) {
      addInfo(info);
      return;
    }

    // If the user did not click on the reaction already, the button is not
    // allowed to have any effect at all.
    if (!use) return;

    // Remove the like from the user's local copy optimistically.
    des.likeUpdt(false);
    props.dupd(des);

    voteDelete(des).catch(() => {
      // catch adds the removed like back to the user's local copy since the
      // backend could not process our request successfully.
      des.likeUpdt(true);
      props.dupd(des);
    });
  };

  // If for whatever reason there is no description on an event anymore, we
  // prevent the webapp from crashing and just return early.
  if (props.desc.length === 0) {
    return <></>;
  }

  return (
    <div className="max-h-[404px] overflow-y-auto">
      {!props.xpnd && (
        <Description
          amnt={props.desc.length}
          desc={props.desc[0]}
          drem={(des: DescriptionSearchObject) => descriptionDelete(des)}
          evnt={props.evnt}
          radd={radd}
          rrem={rrem}
        />
      )}
      {props.xpnd && (
        <>
          {props.desc.map((x, i) => (
            <Description
              key={i}
              amnt={props.desc.length}
              desc={x}
              drem={(des: DescriptionSearchObject) => descriptionDelete(des)}
              evnt={props.evnt}
              radd={radd}
              rrem={rrem}
            />
          ))}
        </>
      )}
      {props.form && (
        <div className="bg-gray-50 dark:bg-gray-800 first:border-none border-t-solid border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <div className="flex-shrink-0 flex flex-row">
              <a
                href={`/user/${user?.public?.name}`}
                onClick={onLinkClick}
                className="flex items-center pl-2"
              >
                <Image
                  alt="profile picture"
                  className="w-7 h-7 rounded-full"
                  height={28}
                  width={28}
                  src={user?.picture || ""}
                />
              </a>
              <a
                href={`/user/${user?.public?.name}`}
                onClick={onLinkClick}
                className="flex items-center pl-2 py-3 text-gray-900 dark:text-gray-50 text-sm font-medium whitespace-nowrap hover:underline"
              >
                {user?.public?.name}
              </a>
              {user?.intern?.uuid === props.evnt.user() && (
                <span className="relative inline-block flex items-center rounded mx-2 my-3 px-[3px] text-xs font-medium bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400 border border-sky-500 cursor-pointer group">
                  EC
                  <div className="absolute top-[-50%] left-[105%] ml-2 z-10 whitespace-nowrap invisible group-hover:visible p-2 text-sm font-medium rounded-lg bg-gray-800 dark:bg-gray-200 text-gray-50 dark:text-gray-900">
                    Event Creator
                  </div>
                </span>
              )}
            </div>
          </div>

          <DescriptionCreateForm
            cncl={props.cncl}
            done={props.dadd}
            evnt={props.evnt.evnt()}
          />

        </div>
      )}
    </div>
  );
};

function onLinkClick(evn: MouseEvent<HTMLAnchorElement>) {
  evn.stopPropagation();
}
