import API from "@/modules/api/policy/API";
import { PolicySearchRequest } from "@/modules/api/policy/search/Request";
import { PolicySearchResponse } from "@/modules/api/policy/search/Response";

import type { RpcError } from "@protobuf-ts/runtime-rpc";

export async function PolicySearch(req: PolicySearchRequest[]): Promise<PolicySearchResponse[]> {
  try {
    const cal = await API.search(
      {
        object: req.map((x) => {
          if (x.ltst) return { symbol: { ltst: x.ltst } }
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
    const b = isPolicyMember(err)
    console.log(1, b)
    if (b) return [];
    console.log(2)
    return Promise.reject(err);
  }
}

const isPolicyMember = (err: any): boolean => {
  const rpc: RpcError = err as RpcError;
  return rpc && rpc.meta?.kind === "PolicyMemberError";
}
