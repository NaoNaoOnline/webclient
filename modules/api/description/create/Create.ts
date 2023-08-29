import API from '@/modules/api/description/API';
import { DescriptionCreateRequest } from '@/modules/api/description/create/Request';
import { DescriptionCreateResponse } from '@/modules/api/description/create/Response';

export async function DescriptionCreate(req: DescriptionCreateRequest[]): Promise<DescriptionCreateResponse[]> {
  try {
    const cal = await API.create(
      {
        object: req.map((x) => ({
          intern: {},
          public: {
            evnt: x.evnt,
            text: x.text,
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
      desc: x.intern?.desc || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
