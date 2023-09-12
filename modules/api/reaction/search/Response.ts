export interface ReactionSearchResponse {
  // local
  amnt: number; // used for aggregating user reactions
  clck: boolean; // used for tracking user reactions
  // intern
  rctn: string;
  // public
  html: string;
  kind: string;
  name: string;
}
