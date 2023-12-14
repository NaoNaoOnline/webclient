import { SubscriptionSearchResponse } from "@/modules/api/subscription/search/Response";

// ExistsSubs expresses whether a subscription object exists with the given
// status and optionally, with the given unix timestamp, if any.
export const ExistsSubs = (sub: SubscriptionSearchResponse[], sta: string, uni?: number): boolean => {
  for (let i = 0; i < sub.length; i++) {
    const u: boolean = !uni || Number(sub[i].unix) === uni;
    const s: boolean = sub[i].stts === sta;

    if (u && s) {
      return true;
    }
  }

  return false;
};
