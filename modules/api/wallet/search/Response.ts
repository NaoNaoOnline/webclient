export interface WalletSearchResponse {
  intern: WalletSearchResponseIntern;
  public: WalletSearchResponsePublic;
}

export interface WalletSearchResponseIntern {
  addr: WalletSearchResponseInternAddr;
  crtd: string;
  user: string;
  wllt: string;
}

export interface WalletSearchResponseInternAddr {
  time: string;
}

export interface WalletSearchResponsePublic {
  addr: string;
  kind: string;
}
