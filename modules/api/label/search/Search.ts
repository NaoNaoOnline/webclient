import API from '@/modules/api/label/API';
import { LabelSearchRequest } from '@/modules/api/label/search/Request';
import { LabelSearchResponse } from '@/modules/api/label/search/Response';

export async function LabelSearch(req: LabelSearchRequest[]): Promise<LabelSearchResponse[]> {
  try {
    const call = API.search(
      {
        object: req.map((r) => ({
          intern: {
            kind: r.kind,
            labl: r.labl,
          },
          public: {},
        })),
      },
      {
        meta: {
          authorization: "Bearer " + req[0].atkn,
        },
      },
    );

    const sta = await call.status;

    if (sta.code !== "OK") throw "call status was not ok";

    const res = await call.response;

    return res.object.map((x) => ({
      labl: x.intern?.labl || "",
      name: x.public?.name || "",
    }));
  } catch (error) {
    throw error;
  }
}
