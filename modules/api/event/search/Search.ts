import API from '@/modules/api/event/API';
import { EventSearchRequest } from '@/modules/api/event/search/Request';
import { EventSearchResponse } from '@/modules/api/event/search/Response';

export async function EventSearch(req: EventSearchRequest[]): Promise<EventSearchResponse[]> {
  try {
    const cal = await API.search(
      {
        object: req.length === 0 ? [] : req.map((x) => ({
          intern: {
            evnt: x.evnt,
          },
          public: {
            cate: "",
            host: "",
          },
        })),
      },
    );

    return cal.response.object.map((x) => ({
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
  } catch (err) {
    return Promise.reject(err);
  }
}
