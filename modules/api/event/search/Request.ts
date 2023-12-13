export interface EventSearchRequest {
  // local
  atkn: string;
  // filter
  kind: string;
  strt: string;
  stop: string;
  // intern
  evnt: string;
  user: string;
  // public
  cate: string;
  host: string;
  // symbol
  like: string;
  list: string;
  time: string;
}
