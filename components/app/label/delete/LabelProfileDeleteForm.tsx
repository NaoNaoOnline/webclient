import { MouseEvent, memo } from "react";

import { RiDeleteBinLine } from "react-icons/ri";

import { useAuth } from "@/components/app/auth/AuthProvider";
import { ErrorPropsObject } from "@/components/app/toast/ErrorToast";
import { ProgressPropsObject } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject } from "@/components/app/toast/SuccessToast";
import { useToast } from "@/components/app/toast/ToastProvider";

import { LabelUpdate } from "@/modules/api/label/update/Update";
import { LabelUpdateRequest } from "@/modules/api/label/update/Request";

interface Props {
  done: (key: string) => void;
  labl: string;
  pkey: string;
  pval: string;
}

const LabelProfileDeleteForm = memo((props: Props) => {
  const { addErro, addPgrs, addScss } = useToast();
  const { atkn } = useAuth();

  const pgrs: ProgressPropsObject = new ProgressPropsObject("Deleting Profile");
  const scss: SuccessPropsObject = new SuccessPropsObject("It's not much, but it's honest work!");

  const deletePrfl = async () => {
    addPgrs(pgrs);

    try {
      pgrs.setCmpl(25);
      await new Promise(r => setTimeout(r, 200));
      pgrs.setCmpl(50);
      await new Promise(r => setTimeout(r, 200));

      const req: LabelUpdateRequest = {
        // local
        atkn: atkn,
        // intern
        labl: props.labl,
        // update
        oper: ["remove"],
        path: ["/prfl/data/" + props.pkey],
        valu: [props.pval],
      };

      const [upd] = await LabelUpdate([req]);

      addScss(scss);
      pgrs.setDone(() => {
        props.done(props.pkey);
      });
    } catch (err) {
      addErro(new ErrorPropsObject("Told ya, told yaaaaaaaa, this ain't gonna fly!", err as Error));
    }
  };

  return (
    <button
      className="ml-3 outline-none invisible group-hover/RowGrid:visible"
      type="button"
      onClick={(eve: MouseEvent<HTMLButtonElement>) => {
        eve.preventDefault();
        eve.stopPropagation();
        deletePrfl();
      }}
    >
      <RiDeleteBinLine
        className={`
           w-5 h-5 text-gray-500 dark:text-gray-500
           hover:text-gray-900 dark:hover:text-gray-50
        `}
      />
    </button>
  );
});

LabelProfileDeleteForm.displayName = "LabelProfileDeleteForm";

export { LabelProfileDeleteForm };
