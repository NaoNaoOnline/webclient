import { MutableRefObject } from "react";

import ListSearch from "@/components/app/list/ListSearch";

import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastContext";

import { useAuth } from "@/components/app/auth/AuthContext";

import { ListCreate } from "@/modules/api/list/create/Create";
import { ListSearchResponse } from "@/modules/api/list/search/Response";

interface Props {
  done: (lis: ListSearchResponse) => void;
  fail: (lis: ListSearchResponse) => void;
  list: ListSearchResponse[];
  salt: string;
  slct: (lis: ListSearchResponse[]) => void;
}

export function ListCreateForm(props: Props) {
  const { addErro, addPgrs, addScss } = useToast();
  const { atkn, uuid } = useAuth();

  const createList = async (des: string) => {
    const pgrs: ProgressPropsObject = new ProgressPropsObject("Adding New List");
    const scss: SuccessPropsObject = new SuccessPropsObject("Certified, and what a list it is!");

    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [lis] = await ListCreate([{ atkn: atkn, desc: des }]);

      const newList = {
        // intern
        crtd: lis.crtd,
        list: lis.list,
        user: uuid,
        // public
        desc: des,
      };

      pgrs.setDone(() => {
        props.done(newList);
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      props.fail({ crtd: "", list: "", user: "", desc: des });
      addErro(new ErrorPropsObject("Don't know what to tell ya, shit's not right around here!", err as Error));
    }
  };

  return (
    <ListSearch
      clis={(des: string) => createList(des)}
      list={props.list}
      salt={props.salt}
      slct={(lis: ListSearchResponse[]) => props.slct(lis)}
    />
  );
}
