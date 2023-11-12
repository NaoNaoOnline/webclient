import API from "@/modules/api/description/API";
import { DescriptionSearchRequest } from "@/modules/api/description/search/Request";
import { DescriptionSearchResponse } from "@/modules/api/description/search/Response";

export async function DescriptionSearch(req: DescriptionSearchRequest[]): Promise<DescriptionSearchResponse[]> {
  try {
    const cal = await API.search(
      {
        object: req.map((x) => {
          if (x.user) return { intern: { user: x.user } }
          if (x.evnt) return { public: { evnt: x.evnt } }
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
      // local
      imag: "",
      name: "",
      // intern
      crtd: x.intern?.crtd || "",
      desc: x.intern?.desc || "",
      user: x.intern?.user || "",
      // public
      evnt: x.public?.evnt || "",
      text: x.public?.text || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
