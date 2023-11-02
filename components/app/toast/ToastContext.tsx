import { ReactNode, createContext, useContext, useState } from "react";

import * as Toast from "@radix-ui/react-toast";

import { ProgressPropsObject, ProgressToast } from "@/components/app/toast/ProgressToast";
import { SuccessPropsObject, SuccessToast } from "@/components/app/toast/SuccessToast";

const defaultContextValue = {
  addPgrs: (prp: ProgressPropsObject) => { },
  addScss: (scs: SuccessPropsObject) => { },
};

const ToastContext = createContext(defaultContextValue);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
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

  const addPgrs = (prp: ProgressPropsObject) => {
    prp.setRndr(tglRndr);
    setPgrs((old: ProgressPropsObject[]) => [...old, prp]);
  };

  const addScss = (scs: SuccessPropsObject) => {
    setScss((old: SuccessPropsObject[]) => [...old, scs]);
  };

  return (
    <ToastContext.Provider value={{ addPgrs, addScss }}>
      <Toast.Provider>

        {children}

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
