import API from '@/modules/api/description/API';
import { DescriptionDeleteRequest } from '@/modules/api/description/delete/Request';
import { DescriptionDeleteResponse } from '@/modules/api/description/delete/Response';

export async function DescriptionDelete(req: DescriptionDeleteRequest[]): Promise<DescriptionDeleteResponse[]> {
  try {
    const cal = await API.delete(
      {
        object: req.map((x) => ({
          intern: {
            desc: x.desc,
          },
          public: {},
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
