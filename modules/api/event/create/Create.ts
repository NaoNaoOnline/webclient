import API from '@/modules/api/event/API';
import { EventCreateRequest } from '@/modules/api/event/create/Request';
import { EventCreateResponse } from '@/modules/api/event/create/Response';

export async function EventCreate(req: EventCreateRequest[]): Promise<EventCreateResponse[]> {
  try {
    const call = await API.create(
      {
        object: req.map((x) => ({
          intern: {},
          public: {
            cate: x.cate,
            dura: x.dura,
            host: x.host,
            link: x.link,
            time: x.time,
          },
        })),
      },
      {
        meta: {
          authorization: "Bearer " + req[0].atkn,
        },
      },
    );

    return call.response.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      evnt: x.intern?.evnt || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
