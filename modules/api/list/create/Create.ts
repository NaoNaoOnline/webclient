import API from "@/modules/api/list/API";
import { ListCreateRequest } from "@/modules/api/list/create/Request";
import { ListCreateResponse } from "@/modules/api/list/create/Response";

export async function ListCreate(req: ListCreateRequest[]): Promise<ListCreateResponse[]> {
  try {
    const cal = await API.create(
      {
        object: req.map((x) => ({
          intern: {},
          public: {
            desc: x.desc,
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
      crtd: x.intern?.crtd || "",
      list: x.intern?.list || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
