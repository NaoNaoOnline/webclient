import API from '@/modules/api/wallet/API';
import { WalletUpdateRequest } from '@/modules/api/wallet/update/Request';
import { WalletUpdateResponse } from '@/modules/api/wallet/update/Response';

export async function WalletUpdate(req: WalletUpdateRequest[]): Promise<WalletUpdateResponse[]> {
  try {
    const cal = await API.update(
      {
        object: req.map((x) => ({
          intern: {
            wllt: x.wllt,
          },
          public: {
            mess: x.mess,
            pubk: x.pubk,
            sign: x.sign,
          },
          update: [],
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
