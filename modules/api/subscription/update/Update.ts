import API from '@/modules/api/subscription/API';
import { SubscriptionUpdateRequest } from '@/modules/api/subscription/update/Request';
import { SubscriptionUpdateResponse } from '@/modules/api/subscription/update/Response';

export async function SubscriptionUpdate(req: SubscriptionUpdateRequest[]): Promise<SubscriptionUpdateResponse[]> {
  try {
    const cal = await API.update(
      {
        object: req.map((x) => ({
          symbol: {
            pntr: x.pntr,
            sync: x.sync,
          },
          update: [],
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
      stts: x.intern?.stts || "",
      // symbol
      pntr: x.symbol?.pntr || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
