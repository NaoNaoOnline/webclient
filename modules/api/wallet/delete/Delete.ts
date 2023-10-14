import API from "@/modules/api/wallet/API";
import { WalletDeleteRequest } from "@/modules/api/wallet/delete/Request";
import { WalletDeleteResponse } from "@/modules/api/wallet/delete/Response";

export async function WalletDelete(req: WalletDeleteRequest[]): Promise<WalletDeleteResponse[]> {
  try {
    const cal = await API.delete(
      {
        object: req.map((x) => ({
          intern: {
            wllt: x.wllt,
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
