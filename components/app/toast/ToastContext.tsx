import { ReactNode, createContext, useContext, useState } from "react";

import * as Toast from "@radix-ui/react-toast";

import { ErrorPropsObject, ErrorToast } from "@/components/app/toast/ErrorToast";
import { InfoPropsObject, InfoToast } from "@/components/app/toast/InfoToast";
import { ProgressPropsObject, ProgressToast } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject, SuccessToast } from "@/components/app/toast/SuccessToast";

const defaultContextValue = {
  addErro: (err: ErrorPropsObject) => { },
  addInfo: (inf: InfoPropsObject) => { },
  addPgrs: (prp: ProgressPropsObject) => { },
  addScss: (scs: SuccessPropsObject) => { },
};

const ToastContext = createContext(defaultContextValue);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [erro, setErro] = useState<ErrorPropsObject[]>([]);
  const [info, setInfo] = useState<InfoPropsObject[]>([]);
  const [pgrs, setPgrs] = useState<ProgressPropsObject[]>([]);
  const [scss, setScss] = useState<SuccessPropsObject[]>([]);

  const [rndr, setRndr] = useState<boolean>(false);

  // The render toggle here triggers a state change inside the toast provider so
  // that changes made to the toast data use across the webapp can be reflected
  // on demand in the UI. Any toast component may define a setter method and
  // trigger component re-rendering based on their individual internal
  // implementation details. See the ProgressToast component as an example.
  //
  //     setRndr(val: () => void)
  //
  const tglRndr = () => {
    setRndr((old: boolean) => !old);
  };

  const addErro = (err: ErrorPropsObject) => {
    setErro((old: ErrorPropsObject[]) => [...old, err]);
  };

  const addInfo = (inf: InfoPropsObject) => {
    setInfo((old: InfoPropsObject[]) => [...old, inf]);
  };

  const addPgrs = (prp: ProgressPropsObject) => {
    prp.setRndr(tglRndr);
    setPgrs((old: ProgressPropsObject[]) => [...old, prp]);
  };

  const addScss = (scs: SuccessPropsObject) => {
    setScss((old: SuccessPropsObject[]) => [...old, scs]);
  };

  return (
    <ToastContext.Provider value={{ addErro, addInfo, addPgrs, addScss }}>
      <Toast.Provider>

        {children}

        {erro.map((x, i) => (
          <ErrorToast
            key={i}
            obj={x}
          />
        ))}

        {info.map((x, i) => (
          <InfoToast
            key={i}
            obj={x}
          />
        ))}

        {pgrs.map((x, i) => (
          <ProgressToast
            key={i}
            obj={x}
          />
        ))}

        {scss.map((x, i) => (
          <SuccessToast
            key={i}
            obj={x}
          />
        ))}

      </Toast.Provider>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
