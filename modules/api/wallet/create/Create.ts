import API from '@/modules/api/wallet/API';
import { WalletCreateRequest } from '@/modules/api/wallet/create/Request';
import { WalletCreateResponse } from '@/modules/api/wallet/create/Response';

export async function WalletCreate(req: WalletCreateRequest[]): Promise<WalletCreateResponse[]> {
  try {
    const cal = await API.create(
      {
        object: req.map((x) => ({
          intern: {},
          public: {
            kind: x.kind,
            mess: x.mess,
            pubk: x.pubk,
            sign: x.sign,
          },
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
      crtd: x.intern?.crtd || "",
      wllt: x.intern?.wllt || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
