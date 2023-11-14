import { UpdateI_Object } from "@naonaoonline/apitscode/src/wallet/update";

import API from '@/modules/api/wallet/API';
import { WalletUpdateRequest } from '@/modules/api/wallet/update/Request';
import { WalletUpdateResponse } from '@/modules/api/wallet/update/Response';

export async function WalletUpdate(req: WalletUpdateRequest[]): Promise<WalletUpdateResponse[]> {
  try {
    const cal = await API.update(
      {
        object: req.map(newObct),
      },
      {
        meta: {
          authorization: req[0].atkn ? "Bearer " + req[0].atkn : "",
        },
      },
    );

    return cal.response.object.map((x) => ({
      intern: {
        addr: {
          time: x.intern?.addr?.time || "",
        },
        labl: {
          time: x.intern?.labl?.time || "",
        },
        stts: x.intern?.stts || "",
      },
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}

const newObct = (x: WalletUpdateRequest): UpdateI_Object => {
  if (x.sign) {
    return {
      intern: {
        wllt: x.wllt,
      },
      public: {
        mess: x.mess,
        pubk: x.pubk,
        sign: x.sign,
      },
      update: [],
    };
  }

  if (x.valu.length !== 0) {
    return {
      intern: {
        wllt: x.wllt,
      },
      update: x.valu.map((y, i) => {
        return {
          ope: x.oper[i],                 // add or remove
          pat: "/labl/data/" + x.path[i], // - or N
          val: x.valu[i],                 // unassigned, accounting or moderation
        };
      }),
    };
  }

  return {
    update: [],
  };
};
