import API from "@/modules/api/description/API";
import { DescriptionUpdateRequest } from "@/modules/api/description/update/Request";
import { DescriptionUpdateResponse } from "@/modules/api/description/update/Response";
import { UpdateI_Object } from "@naonaoonline/apitscode/src/description/update";

export async function DescriptionUpdate(req: DescriptionUpdateRequest[]): Promise<DescriptionUpdateResponse[]> {
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

const newObct = (x: DescriptionUpdateRequest): UpdateI_Object => {
  if (x.text) {
    return {
      intern: {
        desc: x.desc,
      },
      update: [
        {
          ope: "replace",
          pat: "/text",
          val: x.text,
        },
      ],
    };
  }

  if (x.like) {
    return {
      intern: {
        desc: x.desc,
      },
      symbol: {
        like: x.like,
      },
      update: [],
    };
  }

  return {
    intern: {
      desc: "",
    },
    symbol: {
      like: "",
    },
    update: [],
  };
};
