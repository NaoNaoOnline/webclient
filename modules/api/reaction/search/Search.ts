import API from '@/modules/api/reaction/API';
import { ReactionSearchRequest } from '@/modules/api/reaction/search/Request';
import { ReactionSearchResponse } from '@/modules/api/reaction/search/Response';

export async function ReactionSearch(req: ReactionSearchRequest): Promise<ReactionSearchResponse[]> {
  try {
    const call = API.search(
      {
        object: [],
      },
      {
        meta: {
          authorization: "Bearer " + req.atkn,
        },
      },
    );

    const sta = await call.status;

    if (sta.code !== "OK") throw "call status was not ok";

    const res = await call.response;

    return res.object.map((x) => ({
      // local
      amnt: 0,
      clck: false,
      // intern
      rctn: x.intern?.rctn || "",
      // public
      html: x.public?.html || "",
      name: x.public?.name || "",
    }));
  } catch (error) {
    throw error;
  }
}
