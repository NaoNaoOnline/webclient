import API from "@/modules/api/description/API";
import { DescriptionUpdateRequest } from "@/modules/api/description/update/Request";
import { DescriptionUpdateResponse } from "@/modules/api/description/update/Response";

export async function DescriptionUpdate(req: DescriptionUpdateRequest[]): Promise<DescriptionUpdateResponse[]> {
  try {
    const cal = await API.update(
      {
        object: req.map((x) => ({
          intern: {
            desc: x.desc,
          },
          public: {},
          update: [{
            ope: "replace",
            pat: "/text",
            val: x.text,
          }],
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
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
