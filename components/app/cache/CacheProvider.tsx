import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/app/auth/AuthProvider";

import { LabelSearchResponse } from "@/modules/api/label/search/Response";
import { LabelSearch } from "@/modules/api/label/search/Search";
import { NewLabelKindSearchRequest } from "@/modules/api/label/search/Request";
import { ListSearch } from "@/modules/api/list/search/Search";
import { ListSearchResponse } from "@/modules/api/list/search/Response";
import { PolicySearch } from "@/modules/api/policy/search/Search";
import { PolicySearchResponse } from "@/modules/api/policy/search/Response";
import { UserSearchResponse } from "@/modules/api/user/search/Response";
import { UserSearch } from "@/modules/api/user/search/Search";
import { WalletSearch } from "@/modules/api/wallet/search/Search";
import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";
import { WalletLabelModeration } from "@/modules/wallet/Label";

const defaultContextValue: {
  labl: LabelSearchResponse[];
  list: ListSearchResponse[];
  plcy: PolicySearchResponse[];
  user: UserSearchResponse[];
  wllt: WalletSearchResponse[];

  addLabl: (lab: LabelSearchResponse) => void;
  addList: (lis: ListSearchResponse) => void;
  addPlcy: (wal: PolicySearchResponse) => void;
  addUser: (use: UserSearchResponse) => void;
  addWllt: (wal: WalletSearchResponse) => void;

  remLabl: (lab: LabelSearchResponse) => void;
  remList: (lis: ListSearchResponse) => void;
  remPlcy: (wal: PolicySearchResponse) => void;
  remUser: (use: UserSearchResponse) => void;
  remWllt: (wal: WalletSearchResponse) => void;

  updList: (rem: ListSearchResponse, add: ListSearchResponse) => void;
  updPlcy: (set: PolicySearchResponse[]) => void;
  updUser: (rem: UserSearchResponse, add: UserSearchResponse) => void;
  updWllt: (rem: WalletSearchResponse, add: WalletSearchResponse) => void;

  hasAcce: (sys: number, acc: number) => boolean;
  hasMemb: (use: string) => boolean;
} = {
  labl: [],
  list: [],
  plcy: [],
  user: [],
  wllt: [],

  addLabl: (lab: LabelSearchResponse) => { },
  addList: (lis: ListSearchResponse) => { },
  addPlcy: (pol: PolicySearchResponse) => { },
  addUser: (use: UserSearchResponse) => { },
  addWllt: (wal: WalletSearchResponse) => { },

  remLabl: (lab: LabelSearchResponse) => { },
  remList: (lis: ListSearchResponse) => { },
  remPlcy: (pol: PolicySearchResponse) => { },
  remUser: (use: UserSearchResponse) => { },
  remWllt: (wal: WalletSearchResponse) => { },


  updList: (rem: ListSearchResponse, add: ListSearchResponse) => { },
  updPlcy: (set: PolicySearchResponse[]) => { },
  updUser: (rem: UserSearchResponse, add: UserSearchResponse) => { },
  updWllt: (rem: WalletSearchResponse, add: WalletSearchResponse) => { },

  hasAcce: (sys: number, acc: number): boolean => { return false; },
  hasMemb: (use: string): boolean => { return false; },
};

const CacheContext = createContext(defaultContextValue);

export const CacheProvider = ({ children }: { children: ReactNode }) => {
  const { atkn, auth, uuid } = useAuth();

  const [labl, setLabl] = useState<LabelSearchResponse[]>([]);
  const [list, setList] = useState<ListSearchResponse[]>([]);
  const [plcy, setPlcy] = useState<PolicySearchResponse[]>([]);
  const [user, setUser] = useState<UserSearchResponse[]>([]);
  const [wllt, setWllt] = useState<WalletSearchResponse[]>([]);

  const labc = useRef(false);
  const lisc = useRef(false);
  const polc = useRef(false);
  const usec = useRef(false);
  const walc = useRef(false);

  useEffect(() => {
    if (labc.current) return;

    labc.current = true;

    LabelSearch(NewLabelKindSearchRequest(["bltn", "cate", "host"])).then((lab: LabelSearchResponse[]) => {
      if (lab.length === 0) return;
      setLabl(lab);
    });
  }, []);

  useEffect(() => {
    if (lisc.current || !auth) return;

    lisc.current = true;

    ListSearch([{ user: uuid }]).then((lis: ListSearchResponse[]) => {
      if (lis.length === 0) return;
      setList(lis);
    });
  }, [auth, uuid]);

  useEffect(() => {
    if (polc.current || !auth) return;

    polc.current = true;

    PolicySearch([{ atkn: atkn, ltst: "default" }]).then((pol: PolicySearchResponse[]) => {
      if (pol.length === 0) return;
      setPlcy(pol);
    });
  }, [atkn, auth]);

  useEffect(() => {
    if (usec.current || !auth) return;

    usec.current = true;

    UserSearch([{ user: uuid, name: "", self: false }]).then((use: UserSearchResponse[]) => {
      if (use.length === 0) return;
      setUser(use);
    });
  }, [atkn, auth, uuid]);

  useEffect(() => {
    if (walc.current || !auth) return;

    walc.current = true;

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

  const addUser = (use: UserSearchResponse) => {
    setUser((old: UserSearchResponse[]) => [...old, use]);
  };

  const addWllt = (wal: WalletSearchResponse) => {
    setWllt((old: WalletSearchResponse[]) => [...old, wal]);
  };

  const remLabl = (lab: LabelSearchResponse) => {
    setLabl((old: LabelSearchResponse[]) => old.filter((x) => x.labl !== lab.labl));
  };

  const remList = (lis: ListSearchResponse) => {
    setList((old: ListSearchResponse[]) => old.filter((x) => (x.list !== "" && lis.list !== "" && x.list !== lis.list) || ((x.list === "" || lis.list === "") && x.desc !== lis.desc)));
  };

  const remPlcy = (pol: PolicySearchResponse) => {
    setPlcy((old: PolicySearchResponse[]) => old.filter((x) => !(x.syst === pol.syst && x.memb === pol.memb && x.acce === pol.acce)));
  };

  const remUser = (use: UserSearchResponse) => {
    setUser((old: UserSearchResponse[]) => old.filter((x) => x.user !== use.user));
  };

  const remWllt = (wal: WalletSearchResponse) => {
    setWllt((old: WalletSearchResponse[]) => old.filter((x) => x.intern.wllt !== wal.intern.wllt));
  };

  const updList = (rem: ListSearchResponse, add: ListSearchResponse) => {
    setList((old: ListSearchResponse[]) => {
      const upd: ListSearchResponse[] = old.filter((x) => (x.list !== "" && rem.list !== "" && x.list !== rem.list) || ((x.list === "" || rem.list === "") && x.desc !== rem.desc));

      upd.push(add);

      return upd;
    });
  };

  const updPlcy = (set: PolicySearchResponse[]) => {
    setPlcy(set);
  };

  const updUser = (rem: UserSearchResponse, add: UserSearchResponse) => {
    setUser((old: UserSearchResponse[]) => {
      const upd: UserSearchResponse[] = old.filter((x) => x.user !== rem.user);

      upd.push(add);

      return upd;
    });
  };

  const updWllt = (rem: WalletSearchResponse, add: WalletSearchResponse) => {
    setWllt((old: WalletSearchResponse[]) => {
      const upd: WalletSearchResponse[] = old.filter((x) => x.intern.wllt !== rem.intern.wllt);

      upd.push(add);

      return upd;
    });
  };

  // hasAcce expresses whether the current user has at least the given access in
  // the given system. Note that zero is the highest access level. Access must
  // be granted in two ways. First, permissions have to be recorded onchain
  // within the policy smart contracts. Second, user wallets must be labelled
  // for moderation.
  const hasAcce = (sys: number, acc: number): boolean => {
    return plcy.some((x: PolicySearchResponse) => Number(x.syst) === sys && hasMemb(x.memb) && Number(x.acce) <= acc);
  };

  // hasMemb expresses whether any of the current user's moderation wallets
  // matches the given member.
  const hasMemb = (mem: string): boolean => {
    // Look for all current user wallets labelled for moderation.
    const mdrt: WalletSearchResponse[] = wllt.filter((x: WalletSearchResponse) => hasLabl(x, WalletLabelModeration));
    return mdrt.some((y: WalletSearchResponse) => y.public.addr === mem);
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
        list: srtList(list),
        plcy: srtPlcy(plcy),
        user: user,
        wllt: srtWllt(wllt),

        addLabl: addLabl,
        addList: addList,
        addPlcy: addPlcy,
        addUser: addUser,
        addWllt: addWllt,

        remLabl: remLabl,
        remList: remList,
        remPlcy: remPlcy,
        remUser: remUser,
        remWllt: remWllt,


        updList: updList,
        updPlcy: updPlcy,
        updUser: updUser,
        updWllt: updWllt,

        hasAcce: hasAcce,
        hasMemb: hasMemb,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = () => {
  return useContext(CacheContext);
};

export const hasLabl = (wal: WalletSearchResponse, lab: string): boolean => {
  for (const x of wal.public.labl.split(",")) {
    if (x === lab) return true;
  }

  return false;
};

const srtList = (lis: ListSearchResponse[]): ListSearchResponse[] => {
  lis.sort((x: ListSearchResponse, y: ListSearchResponse) => {
    if (x.desc < y.desc) return -1;
    if (x.desc > y.desc) return +1;
    return 0;
  });

  return lis;
};

const srtPlcy = (lis: PolicySearchResponse[]): PolicySearchResponse[] => {
  lis.sort((x: PolicySearchResponse, y: PolicySearchResponse) => {
    // Sort policies by SMA system in accending order with first priority.
    const xsy = parseInt(x.syst, 10);
    const ysy = parseInt(y.syst, 10);

    if (xsy !== ysy) {
      return xsy - ysy;
    }

    // Sort policies by SMA access in accending order with second priority.
    const xac = parseInt(x.acce, 10);
    const yac = parseInt(y.acce, 10);

    if (xac !== yac) {
      return xac - yac;
    }

    // Sort policies by SMA member in accending order with third priority.
    if (x.memb < y.memb) return -1;
    if (x.memb > y.memb) return +1;

    return 0;
  });

  return lis;
};

const srtWllt = (lis: WalletSearchResponse[]): WalletSearchResponse[] => {
  lis.sort((x: WalletSearchResponse, y: WalletSearchResponse) => {
    if (x.public.addr < y.public.addr) return -1;
    if (x.public.addr > y.public.addr) return +1;
    return 0;
  });

  return lis;
};
