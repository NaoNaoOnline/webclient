import { SearchO_Object_Public_Rtng } from '@naonaoonline/apitscode/src/description/search';

export interface DescriptionSearchResponse {
  // local
  imag: string; // used for user image
  name: string; // used for user name
  // intern
  crtd: string;
  desc: string;
  user: string;
  // public
  evnt: string;
  rtng: { [key: string]: SearchO_Object_Public_Rtng };
  text: string;
}
