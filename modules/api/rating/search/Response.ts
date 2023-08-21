export interface RatingSearchResponse {
  amnt: number; // local field for aggregating user reactions
  clck: boolean; // local field for tracking user reactions
  html: string;
  name: string;
}
