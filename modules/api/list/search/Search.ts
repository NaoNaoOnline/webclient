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
    );

    return call.response.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      list: x.intern?.list || "",
      user: x.intern?.user || "",
      // public
      desc: x.public?.desc || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
