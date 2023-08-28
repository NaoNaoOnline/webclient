import API from '@/modules/api/vote/API';
import { VoteSearchRequest } from '@/modules/api/vote/search/Request';
import { VoteSearchResponse } from '@/modules/api/vote/search/Response';

export async function VoteSearch(req: VoteSearchRequest[]): Promise<VoteSearchResponse[]> {
  try {
    const call = API.search(
      {
        object: req.map((r) => ({
          intern: {
          },
          public: {
            desc: r.desc,
          },
        })),
      },
      {
        meta: {
          authorization: "Bearer " + req[0].atkn,
        },
      },
    );

    const sta = await call.status;

    if (sta.code !== "OK") throw "call status was not ok";

    const res = await call.response;

    return res.object.map((x) => ({
      // intern
      crtd: x.intern?.crtd || "",
      user: x.intern?.user || "",
      vote: x.intern?.vote || "",
      // public
      desc: x.public?.desc || "",
      rctn: x.public?.rctn || "",
    }));
  } catch (error) {
    throw error;
  }
}
