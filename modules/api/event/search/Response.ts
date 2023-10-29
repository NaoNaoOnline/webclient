export interface EventSearchResponse {
  // extern
  extern: EventSearchResponseExtern[]
  // intern
  crtd: string;
  evnt: string;
  user: string;
  // public
  cate: string;
  dura: string;
  host: string;
  link: string;
  time: string;
}

export interface EventSearchResponseExtern {
  amnt: string;
  kind: string;
  user: boolean;
}
