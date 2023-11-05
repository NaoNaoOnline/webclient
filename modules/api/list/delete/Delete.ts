import API from "@/modules/api/list/API";
import { ListDeleteRequest } from "@/modules/api/list/delete/Request";
import { ListDeleteResponse } from "@/modules/api/list/delete/Response";

export async function ListDelete(req: ListDeleteRequest[]): Promise<ListDeleteResponse[]> {
  try {
    const cal = await API.delete(
      {
        object: req.map((x) => ({
          intern: {
            list: x.list,
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
