import API from '@/modules/api/description/API';
import { DescriptionCreateRequest } from '@/modules/api/description/create/Request';
import { DescriptionCreateResponse } from '@/modules/api/description/create/Response';

export async function DescriptionCreate(req: DescriptionCreateRequest[]): Promise<DescriptionCreateResponse[]> {
  try {
    const call = API.create(
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

    const sta = await call.status;

    if (sta.code !== "OK") throw "call status was not ok";

    const res = await call.response;

    return res.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      desc: x.intern?.desc || "",
    }));
  } catch (error) {
    throw error;
  }
}
