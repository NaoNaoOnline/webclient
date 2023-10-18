import API from "@/modules/api/policy/API";
import { PolicySearchRequest } from "@/modules/api/policy/search/Request";
import { PolicySearchResponse } from "@/modules/api/policy/search/Response";

export async function PolicySearch(req: PolicySearchRequest[]): Promise<PolicySearchResponse[]> {
  try {
    const cal = await API.search(
      {
        object: req.map((x) => {
          if (x.ltst) return { symbol: { ltst: x.ltst } }
          return {};
        }),
      },
    );

    return cal.response.object.map((x) => ({
      // local
      name: "", // will be augmented on demand
      // extern
      extern: x.extern.map((y) => ({
        chid: y.chid,
      })),
      // intern
      user: x.intern?.user || "",
      // public
      acce: x.public?.acce || "",
      memb: x.public?.memb || "",
      syst: x.public?.syst || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
