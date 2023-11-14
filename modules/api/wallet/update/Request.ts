export interface WalletUpdateRequest {
  // local
  atkn: string;
  // intern
  wllt: string;
  // public
  mess: string;
  pubk: string;
  sign: string;
  // update
  oper: string[];
  path: string[];
  valu: string[];
}
