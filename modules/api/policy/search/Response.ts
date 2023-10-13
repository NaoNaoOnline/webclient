export interface PolicySearchResponse {
  // extern
  extern: PolicySearchResponseExtern[]
  // intern
  crtd: string;
  plcy: string;
  // public
  acce: string;
  kind: string;
  memb: string;
  syst: string;
}

export interface PolicySearchResponseExtern {
  blck: string;
  chid: string;
  from: string;
  hash: string;
  time: string;
}
