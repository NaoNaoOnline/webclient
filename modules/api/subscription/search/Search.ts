import API from "@/modules/api/subscription/API";
import { SubscriptionSearchRequest } from "@/modules/api/subscription/search/Request";
import { SubscriptionSearchResponse } from "@/modules/api/subscription/search/Response";

export async function SubscriptionSearch(req: SubscriptionSearchRequest[]): Promise<SubscriptionSearchResponse[]> {
  try {
    const call = await API.search(
      {
        object: req.map((x) => {
          if (x.subs) return { intern: { subs: x.subs, user: "" } }
          if (x.user) return { intern: { user: x.user, subs: "" } }
          if (x.rcvr) return { public: { rcvr: x.rcvr, payr: "" } }
          return {};
        }),
      },
      {
        meta: {
          authorization: req[0].atkn ? "Bearer " + req[0].atkn : "",
        },
      },
    );

    return call.response.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      fail: x.intern?.fail || "",
      stts: x.intern?.stts || "",
      subs: x.intern?.subs || "",
      user: x.intern?.user || "",
      // public
      crtr: x.public?.crtr || "",
      payr: x.public?.payr || "",
      rcvr: x.public?.rcvr || "",
      unix: x.public?.unix || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
