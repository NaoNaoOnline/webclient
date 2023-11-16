import API from "@/modules/api/label/API";
import { LabelSearchRequest } from "@/modules/api/label/search/Request";
import { LabelSearchResponse } from "@/modules/api/label/search/Response";

export async function LabelSearch(req: LabelSearchRequest[]): Promise<LabelSearchResponse[]> {
  try {
    const call = await API.search(
      {
        object: req.map((x) => {
          if (x.labl) return { intern: { labl: x.labl, user: "" } }
          if (x.user) return { intern: { user: x.user, labl: "" } }
          if (x.kind && !x.name) return { public: { kind: x.kind, name: "" } }
          if (x.kind && x.name) return { public: { kind: x.kind, name: x.name } }
          return {};
        }),
      },
    );

    return call.response.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      labl: x.intern?.labl || "",
      user: x.intern?.user || "",
      // public
      kind: x.public?.kind || "",
      name: x.public?.name || "",
      prfl: x.public?.prfl || {},
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
