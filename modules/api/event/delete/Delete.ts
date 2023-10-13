import API from "@/modules/api/event/API";
import { EventDeleteRequest } from "@/modules/api/event/delete/Request";
import { EventDeleteResponse } from "@/modules/api/event/delete/Response";

export async function EventDelete(req: EventDeleteRequest[]): Promise<EventDeleteResponse[]> {
  try {
    const cal = await API.delete(
      {
        object: req.map((x) => ({
          intern: {
            evnt: x.evnt,
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
