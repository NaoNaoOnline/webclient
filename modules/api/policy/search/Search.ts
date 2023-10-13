import API from "@/modules/api/policy/API";
import { PolicySearchRequest } from "@/modules/api/policy/search/Request";
import { PolicySearchResponse } from "@/modules/api/policy/search/Response";

export async function PolicySearch(req: PolicySearchRequest[]): Promise<PolicySearchResponse[]> {
  try {
    const cal = await API.search(
      {
        object: req.map((x) => {
          if (x.ltst) return { symbol: { ltst: x.ltst, } }
          return {};
        }),
      },
    );

    return cal.response.object.map((x) => ({
      // local
      extern: x.extern.map((y) => ({
        blck: y.blck,
        chid: y.chid,
        from: y.from,
        hash: y.hash,
        time: y.time,
      })),
      // intern
      crtd: x.intern?.crtd || "",
      plcy: x.intern?.plcy || "",
      // public
      acce: x.public?.acce || "",
      kind: x.public?.kind || "",
      memb: x.public?.memb || "",
      syst: x.public?.syst || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
