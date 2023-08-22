import API from '@/modules/api/event/API';
import { EventSearchRequest } from '@/modules/api/event/search/Request';
import { EventSearchResponse } from '@/modules/api/event/search/Response';

export async function EventSearch(req: EventSearchRequest[]): Promise<EventSearchResponse[]> {
  try {
    const call = API.search(
      {
        object: req.map((r) => ({
          intern: {
            cate: "",
            evnt: r.evnt,
            host: "",
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
      // intern
      crtd: x.intern?.crtd || "",
      evnt: x.intern?.evnt || "",
      user: x.intern?.user || "",
      // public
      cate: x.public?.cate || "",
      dura: x.public?.dura || "",
      host: x.public?.host || "",
      link: x.public?.link || "",
      time: x.public?.time || "",
    }));
  } catch (error) {
    throw error;
  }
}
