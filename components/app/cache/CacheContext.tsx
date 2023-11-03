import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";

import { useToken } from "@/components/app/token/TokenContext";

import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { LabelSearch } from "@/modules/api/label/search/Search";
import { NewLabelSearchRequest } from "@/modules/api/label/search/Request";
import { ListSearch } from "@/modules/api/list/search/Search";
import { ListSearchResponse } from "@/modules/api/list/search/Response";
import { PolicySearch } from "@/modules/api/policy/search/Search";
import { PolicySearchResponse } from "@/modules/api/policy/search/Response";
import { WalletSearch } from "@/modules/api/wallet/search/Search";
import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";

const defaultContextValue: {
  labl: LabelSearchResponse[];
  list: ListSearchResponse[];
  plcy: PolicySearchResponse[];
  wllt: WalletSearchResponse[];

  addLabl: (lab: LabelSearchResponse) => void;
  addList: (lis: ListSearchResponse) => void;
  addPlcy: (wal: PolicySearchResponse) => void;
  addWllt: (wal: WalletSearchResponse) => void;

  remLabl: (lab: LabelSearchResponse) => void;
  remList: (lis: ListSearchResponse) => void;
  remPlcy: (wal: PolicySearchResponse) => void;
  remWllt: (wal: WalletSearchResponse) => void;
} = {
  labl: [],
  list: [],
  plcy: [],
  wllt: [],

  addLabl: (lab: LabelSearchResponse) => { },
  addList: (lis: ListSearchResponse) => { },
  addPlcy: (pol: PolicySearchResponse) => { },
  addWllt: (wal: WalletSearchResponse) => { },

  remLabl: (lab: LabelSearchResponse) => { },
  remList: (lis: ListSearchResponse) => { },
  remPlcy: (pol: PolicySearchResponse) => { },
  remWllt: (wal: WalletSearchResponse) => { },
};

const CacheContext = createContext(defaultContextValue);

export const CacheProvider = ({ children }: { children: ReactNode }) => {
  const { atkn, auth, uuid } = useToken();

  const [labl, setLabl] = useState<LabelSearchResponse[]>([]);
  const [list, setList] = useState<ListSearchResponse[]>([]);
  const [plcy, setPlcy] = useState<PolicySearchResponse[]>([]);
  const [wllt, setWllt] = useState<WalletSearchResponse[]>([]);

  const labr = useRef(false);
  const lisr = useRef(false);
  const polr = useRef(false);
  const walr = useRef(false);

  useEffect(() => {
    if (labr.current) return;
    labr.current = true;

    LabelSearch(NewLabelSearchRequest("bltn", "cate", "host")).then((lab: LabelSearchResponse[]) => {
      if (lab.length === 0) return;
      setLabl(lab);
    });
  }, []);

  useEffect(() => {
    if (lisr.current || !auth) return;
    lisr.current = true;

    ListSearch([{ atkn: atkn, user: uuid }]).then((lis: ListSearchResponse[]) => {
      if (lis.length === 0) return;
      setList(lis);
    });
  }, [atkn, auth, uuid]);

  useEffect(() => {
    if (polr.current || !auth) return;
    polr.current = true;

    PolicySearch([{ atkn: atkn, ltst: "default" }]).then((pol: PolicySearchResponse[]) => {
      if (pol.length === 0) return;
      setPlcy(pol);
    });
  }, [atkn, auth]);

  useEffect(() => {
    if (walr.current || !auth) return;
    walr.current = true;

    WalletSearch([{ atkn: atkn, kind: "eth", wllt: "" }]).then((wal: WalletSearchResponse[]) => {
      if (wal.length === 0) return;
      setWllt(wal);
    });
  }, [atkn, auth]);

  const addLabl = (lab: LabelSearchResponse) => {
    setLabl((old: LabelSearchResponse[]) => [...old, lab]);
  };

  const addList = (lis: ListSearchResponse) => {
    setList((old: ListSearchResponse[]) => [...old, lis]);
  };

  const addPlcy = (pol: PolicySearchResponse) => {
    setPlcy((old: PolicySearchResponse[]) => [...old, pol]);
  };

  const addWllt = (wal: WalletSearchResponse) => {
    setWllt((old: WalletSearchResponse[]) => [...old, wal]);
  };

  const remLabl = (lab: LabelSearchResponse) => {
    setLabl((old: LabelSearchResponse[]) => old.filter((x) => x.labl !== lab.labl));
  };

  const remList = (lis: ListSearchResponse) => {
    setList((old: ListSearchResponse[]) => old.filter((x) => x.list !== lis.list || x.desc !== lis.desc));
  };

  const remPlcy = (pol: PolicySearchResponse) => {
    setPlcy((old: PolicySearchResponse[]) => old.filter((x) => !(x.syst === pol.syst && x.memb === pol.memb && x.acce === pol.acce)));
  };

  const remWllt = (wal: WalletSearchResponse) => {
    setWllt((old: WalletSearchResponse[]) => old.filter((x) => x.intern.wllt !== wal.intern.wllt));
  };

  // We only want to render the injected child components if we have a label
  // response, since a lot of pages rely on the list of labels known to the
  // system.
  if (labl.length === 0) {
    return <></>;
  }

  return (
    <CacheContext.Provider
      value={{
        labl: labl,
        list: list,
        plcy: plcy,
        wllt: wllt,

        addLabl: addLabl,
        addList: addList,
        addPlcy: addPlcy,
        addWllt: addWllt,

        remLabl: remLabl,
        remList: remList,
        remPlcy: remPlcy,
        remWllt: remWllt,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = () => {
  return useContext(CacheContext);
};
