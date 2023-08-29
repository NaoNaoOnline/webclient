import API from '@/modules/api/label/API';
import { LabelCreateRequest } from '@/modules/api/label/create/Request';
import { LabelCreateResponse } from '@/modules/api/label/create/Response';

export async function LabelCreate(req: LabelCreateRequest[]): Promise<LabelCreateResponse[]> {
  try {
    const cal = await API.create(
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

    return cal.response.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      labl: x.intern?.labl || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
