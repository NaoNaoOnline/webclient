export interface PolicySearchResponse {
  // local
  name: string; // locally augmented user name
  // extern
  extern: PolicySearchResponseExtern[]
  // intern
  user: string;
  // public
  acce: string;
  memb: string;
  syst: string;
}

export interface PolicySearchResponseExtern {
  chid: string;
}
