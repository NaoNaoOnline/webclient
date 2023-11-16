export interface LabelSearchResponse {
  // intern
  crtd: string;
  labl: string;
  user: string;
  // public
  kind: string;
  name: string;
  prfl: Record<string, string>;
}
