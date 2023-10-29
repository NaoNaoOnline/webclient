import API from "@/modules/api/event/API";
import { EventUpdateRequest } from "@/modules/api/event/update/Request";
import { EventUpdateResponse } from "@/modules/api/event/update/Response";

export async function EventUpdate(req: EventUpdateRequest[]): Promise<EventUpdateResponse[]> {
  try {
    const cal = await API.update(
      {
        object: req.map((x) => ({
          intern: {
            evnt: x.evnt,
          },
          public: {},
          update: [],
          symbol: {
            link: x.link,
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
      stts: x.intern?.stts || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
