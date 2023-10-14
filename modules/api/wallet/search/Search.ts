import API from "@/modules/api/wallet/API";
import { WalletSearchRequest } from "@/modules/api/wallet/search/Request";
import { WalletSearchResponse } from "@/modules/api/wallet/search/Response";

export async function WalletSearch(req: WalletSearchRequest[]): Promise<WalletSearchResponse[]> {
  try {
    const call = await API.search(
      {
        object: req.map((x) => {
          if (x.wllt) return { intern: { wllt: x.wllt } }
          if (x.kind) return { public: { kind: x.kind } }
          return {};
        }),
      },
      {
        meta: {
          authorization: req[0].atkn ? "Bearer " + req[0].atkn : "",
        },
      },
    );

    return call.response.object.map((x) => ({
      intern: {
        addr: {
          time: x.intern?.addr?.time || "",
        },
        crtd: x.intern?.crtd || "",
        user: x.intern?.user || "",
        wllt: x.intern?.wllt || "",
      },
      public: {
        addr: x.public?.addr || "",
        kind: x.public?.kind || "",
      },
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
