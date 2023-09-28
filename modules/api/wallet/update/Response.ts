export interface WalletUpdateResponse {
  intern: WalletUpdateResponseIntern;
}

export interface WalletUpdateResponseIntern {
  addr: WalletUpdateResponseInternAddr;
  stts: string;
}

export interface WalletUpdateResponseInternAddr {
  time: string;
}
