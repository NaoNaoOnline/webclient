export interface RatingSearchResponse {
  // local
  amnt: number; // used for aggregating user reactions
  clck: boolean; // used for tracking user reactions
  // public
  html: string;
  name: string;
}
