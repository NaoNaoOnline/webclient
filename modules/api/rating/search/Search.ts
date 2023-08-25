import API from '@/modules/api/rating/API';
import { RatingSearchRequest } from '@/modules/api/rating/search/Request';
import { RatingSearchResponse } from '@/modules/api/rating/search/Response';

export async function RatingSearch(req: RatingSearchRequest): Promise<RatingSearchResponse[]> {
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
      // public
      html: x.public?.html || "",
      name: x.public?.name || "",
    }));
  } catch (error) {
    throw error;
  }
}
