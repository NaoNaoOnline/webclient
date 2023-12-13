import { useEffect, useRef } from "react";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";


import EventSearchObject from "@/modules/api/event/search/Object";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { ListSearchResponse } from "@/modules/api/list/search/Response";
import { UserSearchResponse } from "@/modules/api/user/search/Response";
import { RuleCreate } from "@/modules/api/rule/create/Create";
import { RuleCreateRequest } from "@/modules/api/rule/create/Request";

interface Props {
  cate: LabelSearchResponse[];
  done: () => void;
  evnt: EventSearchObject[];
  fail: () => void;
  host: LabelSearchResponse[];
  incl: boolean;
  list: ListSearchResponse[];
  sbmt: boolean;
  user: UserSearchResponse[];
}

export function RuleCreateForm(props: Props) {
  const { addErro, addPgrs, addScss } = useToast();
  const { atkn } = useAuth();

  const clld = useRef(false);

  const pgrs: ProgressPropsObject = new ProgressPropsObject("Adding New Rules");
  const scss: SuccessPropsObject = new SuccessPropsObject("Couldn't have made it without you, we got them rules!");

  const createRule = async () => {
    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const [rul] = await RuleCreate(newRule());

      pgrs.setDone(() => {
        clld.current = false;
        props.done();
      });

      addScss(scss);
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      clld.current = false;
      props.fail();
      addErro(new ErrorPropsObject("Yeah that didn't work out now didn't it, what a shit show that is!", err as Error));
    }
  };

  const newRule = (): RuleCreateRequest[] => {
    const rul: RuleCreateRequest[] = [];

    for (const x of props.list) {
      if (props.cate.length !== 0) {
        const list: string = props.cate.map((y: LabelSearchResponse) => y.labl).join(',');

        rul.push({
          atkn: atkn,
          excl: !props.incl ? list : "",
          incl: props.incl ? list : "",
          kind: "cate",
          list: x.list,
        });
      }

      if (props.evnt.length !== 0) {
        // Careful here, make sure to call the evnt() function to get the event
        // ID since EventSearchObject is a class instance.
        const list: string = props.evnt.map((y: EventSearchObject) => y.evnt()).join(',');

        rul.push({
          atkn: atkn,
          excl: !props.incl ? list : "",
          incl: props.incl ? list : "",
          kind: "evnt",
          list: x.list,
        });
      }

      if (props.host.length !== 0) {
        const list: string = props.host.map((y: LabelSearchResponse) => y.labl).join(',');

        rul.push({
          atkn: atkn,
          excl: !props.incl ? list : "",
          incl: props.incl ? list : "",
          kind: "host",
          list: x.list,
        });
      }

      if (props.user.length !== 0) {
        const list: string = props.user.map((y: UserSearchResponse) => y.user).join(',');

        rul.push({
          atkn: atkn,
          excl: !props.incl ? list : "",
          incl: props.incl ? list : "",
          kind: "user",
          list: x.list,
        });
      }
    }

    return rul
  };

  // We need to ensure that we only start creating the rules in the backend once
  // the component here finished rendering. This is because creating the rules
  // creates a progress toast that starts the rendering process within our toast
  // provider which is wrapping us. And so if we were to add the toast before
  // this component here was finished rendering iteself, then we would get funky
  // react errors. Note that we leave out the dependency array because adding it
  // seems to have super complicated side effects. If anything is wrong with
  // that and somebody has a better way of doing things, please create a pull
  // request.
  useEffect(() => {
    if (props.sbmt && !clld.current) {
      clld.current = true;
      createRule();
    }
  });

  return (
    <></>
  );
}
