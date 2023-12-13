import API from "@/modules/api/list/API";
import { ListSearchRequest } from "@/modules/api/list/search/Request";
import { ListSearchResponse } from "@/modules/api/list/search/Response";

export async function ListSearch(req: ListSearchRequest[]): Promise<ListSearchResponse[]> {
  try {
    const call = await API.search(
      {
        object: req.map((x) => ({
          intern: {
            user: x.user,
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

    return call.response.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      list: x.intern?.list || "",
      user: x.intern?.user || "",
      // public
      desc: x.public?.desc || "",
      feed: x.public?.feed || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
