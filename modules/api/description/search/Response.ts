export interface DescriptionSearchResponse {
  // extern
  extern: DescriptionSearchResponseExtern[]
  // local
  imag: string; // used for user image
  name: string; // used for user name
  // intern
  crtd: string;
  desc: string;
  user: string;
  // public
  evnt: string;
  text: string;
}

export interface DescriptionSearchResponseExtern {
  amnt: string;
  kind: string;
  user: boolean;
}
