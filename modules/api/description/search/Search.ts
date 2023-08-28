import API from '@/modules/api/description/API';
import { DescriptionSearchRequest } from '@/modules/api/description/search/Request';
import { DescriptionSearchResponse } from '@/modules/api/description/search/Response';

export async function DescriptionSearch(req: DescriptionSearchRequest[]): Promise<DescriptionSearchResponse[]> {
  try {
    const call = API.search(
      {
        object: req.map((r) => ({
          intern: {
          },
          public: {
            evnt: r.evnt,
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
      // local
      imag: "",
      name: "",
      // intern
      crtd: x.intern?.crtd || "",
      desc: x.intern?.desc || "",
      user: x.intern?.user || "",
      // public
      evnt: x.public?.evnt || "",
      text: x.public?.text || "",
    }));
  } catch (error) {
    throw error;
  }
}
