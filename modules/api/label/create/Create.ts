import API from '@/modules/api/label/API';
import { LabelCreateRequest } from '@/modules/api/label/create/Request';
import { LabelCreateResponse } from '@/modules/api/label/create/Response';

export async function LabelCreate(req: LabelCreateRequest[]): Promise<LabelCreateResponse[]> {
  try {
    const call = API.create(
      {
        object: req.map((x) => ({
          intern: {},
          public: {
            desc: "",
            disc: "",
            kind: x.kind,
            name: x.name,
            twit: "",
          },
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
      // intern
      crtd: x.intern?.crtd || "",
      labl: x.intern?.labl || "",
    }));
  } catch (error) {
    throw error;
  }
}
