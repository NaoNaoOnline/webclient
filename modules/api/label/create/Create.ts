import API from "@/modules/api/label/API";
import { LabelCreateRequest } from "@/modules/api/label/create/Request";
import { LabelCreateResponse } from "@/modules/api/label/create/Response";

export async function LabelCreate(req: LabelCreateRequest[]): Promise<LabelCreateResponse[]> {
  try {
    const cal = await API.create(
      {
        object: req.map((x) => ({
          intern: {},
          public: {
            kind: x.kind,
            name: x.name,
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
      labl: x.intern?.labl || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
