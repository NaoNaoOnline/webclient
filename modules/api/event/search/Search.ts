import API from "@/modules/api/event/API";
import { EventSearchRequest } from "@/modules/api/event/search/Request";
import { EventSearchResponse } from "@/modules/api/event/search/Response";

export async function EventSearch(req: EventSearchRequest[]): Promise<EventSearchResponse[]> {
  try {
    const cal = await API.search(
      {
        filter: {
          paging: {
            strt: req[0].strt,
            stop: req[0].stop,
          },
        },
        object: req.map((x) => {
          if (x.evnt || x.user) return { intern: { evnt: x.evnt, user: x.user } }
          if (x.cate || x.host) return { public: { cate: x.cate, host: x.host } }
          if (x.list || x.rctn || x.time) return { symbol: { list: x.list, rctn: x.rctn, time: x.time } }
          return {};
        }),
      },
      {
        meta: {
          authorization: req[0].atkn ? "Bearer " + req[0].atkn : "",
        },
      },
    );

    return cal.response.object.map((x) => ({
      // extern
      extern: x.extern.map((y) => ({
        amnt: y.amnt,
        kind: y.kind,
        user: y.user,
      })),
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
