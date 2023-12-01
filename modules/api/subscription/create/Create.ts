import API from "@/modules/api/subscription/API";
import { SubscriptionCreateRequest } from "@/modules/api/subscription/create/Request";
import { SubscriptionCreateResponse } from "@/modules/api/subscription/create/Response";

export async function SubscriptionCreate(req: SubscriptionCreateRequest[]): Promise<SubscriptionCreateResponse[]> {
  try {
    const cal = await API.create(
      {
        object: req.map((x) => ({
          intern: {},
          public: {
            crtr: x.crtr,
            payr: x.payr,
            rcvr: x.rcvr,
            unix: x.unix,
          },
        })),
      },
      {
        meta: {
          authorization: req[0].atkn ? "Bearer " + req[0].atkn : "",
        },
      },
    );

    return cal.response.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      subs: x.intern?.subs || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
