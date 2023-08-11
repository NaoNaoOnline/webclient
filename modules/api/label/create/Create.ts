import API from '@/modules/api/label/API';
import { LabelCreateRequest } from '@/modules/api/label/create/Request';
import { LabelCreateResponse } from '@/modules/api/label/create/Response';

export async function LabelCreate(req: LabelCreateRequest[]): Promise<LabelCreateResponse[]> {
  try {
    const call = API.create(
      {
        object: req.map((r) => ({
          intern: {},
          public: {
            desc: r.desc || "",
            disc: r.disc || "",
            kind: r.kind,
            name: r.name,
            twit: r.twit || "",
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
      crtd: x.intern?.crtd || "",
      labl: x.intern?.labl || "",
    }));
  } catch (error) {
    throw error;
  }
}
