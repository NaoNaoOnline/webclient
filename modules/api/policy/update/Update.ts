import API from '@/modules/api/policy/API';
import { PolicyUpdateRequest } from '@/modules/api/policy/update/Request';
import { PolicyUpdateResponse } from '@/modules/api/policy/update/Response';

export async function PolicyUpdate(req: PolicyUpdateRequest[]): Promise<PolicyUpdateResponse[]> {
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
