export interface WalletUpdateResponse {
  intern: WalletUpdateResponseIntern;
}

export interface WalletUpdateResponseIntern {
  addr: WalletUpdateResponseInternAddr;
  labl: WalletUpdateResponseInternLabl;
  stts: string;
}

export interface WalletUpdateResponseInternAddr {
  time: string;
}

export interface WalletUpdateResponseInternLabl {
  time: string;
}
