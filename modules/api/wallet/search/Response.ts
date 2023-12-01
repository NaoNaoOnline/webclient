export interface WalletSearchResponse {
  intern: WalletSearchResponseIntern;
  public: WalletSearchResponsePublic;
}

export interface WalletSearchResponseIntern {
  // local
  name: string; // TODO
  // intern
  addr: WalletSearchResponseInternAddr;
  crtd: string;
  labl: WalletSearchResponseInternLabl;
  user: string;
  wllt: string;
}

export interface WalletSearchResponseInternAddr {
  time: string;
}

export interface WalletSearchResponseInternLabl {
  time: string;
}

export interface WalletSearchResponsePublic {
  addr: string;
  kind: string;
  labl: string;
}
