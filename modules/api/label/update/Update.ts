import { UpdateI_Object } from "@naonaoonline/apitscode/src/label/update";

import API from "@/modules/api/label/API";
import { LabelUpdateRequest } from "@/modules/api/label/update/Request";
import { LabelUpdateResponse } from "@/modules/api/label/update/Response";

export async function LabelUpdate(req: LabelUpdateRequest[]): Promise<LabelUpdateResponse[]> {
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
      // intern
      stts: x.intern?.stts || "",
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}

const newObct = (x: LabelUpdateRequest): UpdateI_Object => {
  if (x.valu.length !== 0) {
    return {
      intern: {
        labl: x.labl,
      },
      update: x.valu.map((y, i) => {
        return {
          ope: x.oper[i],                      // add or remove
          pat: "/prfl/" + x.path[i] + "/data", // e.g. /prfl/Twitter/data
          val: x.valu[i],                      // e.g. FlashbotsFDN
        };
      }),
    };
  }

  return {
    update: [],
  };
};
